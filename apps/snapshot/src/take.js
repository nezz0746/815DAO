import { GraphQLClient } from "graphql-request";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import SHA256 from "crypto-js/sha256.js";
import fs from "fs/promises";
import "dotenv/config";
import contractsTreeJSON from "../artifacts/contractsTree.json" assert { type: "json" };
import _ from "lodash";
import { ethers } from "ethers";

const { root: addressesRoot, leaves: addressesList } = contractsTreeJSON;

const query = `
  query Query815($skip: Int!, $first: Int!) {
    tokens(skip: $skip,first: $first, where: {identifier: 815}) {
      id
      owner {
        id
      }
    }
  }
`;

const endpoint = `https://gateway.thegraph.com/api/${process.env.API_KEY}/subgraphs/id/B333F7Ra4kuVBSwHFDfH9x9N1341GYHvdfpV94KY8Gmv`;

const client = new GraphQLClient(endpoint, { headers: {} });

const test = false;

const main = async () => {
  let allTokens = [];

  let skip = 0;
  const first = 500;
  const { tokens: firstTokens } = await client.request(query, { skip, first });

  allTokens = [...firstTokens];

  while (skip !== undefined) {
    const { tokens } = await client.request(query, { skip, first });
    if (tokens.length > 0) {
      allTokens = [...allTokens, ...tokens];
      skip = allTokens.length;
      if (test) break;
    } else {
      skip = undefined;
    }
    console.log("skip", skip);
  }
  const contractsTree = new MerkleTree(addressesList, SHA256);

  const userAddresses = _.uniq(
    allTokens
      .filter((token, index) => {
        // Token must be in the contracts tree
        console.log(index);
        const leaf = SHA256(token.id.split("/")[1]); // address
        return contractsTree.verify(
          contractsTree.getProof(leaf),
          leaf,
          addressesRoot
        );
      })
      .map((token) => token.owner.id)
  );

  const unsortedLeaves = userAddresses.map((x) => keccak256(x));
  const tree = new MerkleTree(unsortedLeaves, keccak256, { sort: true });
  const testTree = new MerkleTree(unsortedLeaves.slice(0, 10), keccak256, {
    sort: true,
  });
  [
    [
      "registry.json",
      {
        userAddresses,
      },
    ],
    [
      "registry.test.json",
      {
        userAddresses: userAddresses
          .slice(0, 10)
          .map((add) => ethers.utils.getAddress(add)),
      },
    ],
    [
      "tree.json",
      {
        name: "815DAO",
        timestamp: Date.now(),
        root: tree.getHexRoot(),
        leaves: tree.getHexLeaves(),
      },
    ],
    [
      "tree.test.json",
      {
        name: "815DAO-test",
        timestamp: Date.now(),
        root: testTree.getHexRoot(),
        leaves: testTree.getHexLeaves(),
      },
    ],
  ].forEach(async ([filename, data]) => {
    await fs.writeFile(
      `./artifacts/${filename}`,
      JSON.stringify(data, null, 2)
    );
  });
};

main();
