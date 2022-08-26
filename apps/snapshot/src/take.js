import { GraphQLClient } from "graphql-request";
import { MerkleTree } from "merkletreejs";
import SHA256 from "crypto-js/sha256.js";
import fs from "fs/promises";
import "dotenv/config";
import contractsTreeJSON from "../artifacts/contractsTree.json" assert { type: "json" };

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

  const data = allTokens
    .filter((token, index) => {
      console.log(index);
      const leaf = SHA256(token.id.split("/")[1]);
      return contractsTree.verify(
        contractsTree.getProof(leaf),
        leaf,
        addressesRoot
      );
    })
    .map((token) => token.owner.id);

  const leaves = data.map((x) => SHA256(x));

  const tree = new MerkleTree(leaves, SHA256);

  await fs.writeFile(
    "./tree.json",
    JSON.stringify(
      {
        name: "815DAO",
        timestamp: Date.now(),
        supplyBeyondContractSnapshot: allTokens.length,
        supply: data.length,
        root: tree.getHexRoot(),
        leaves: tree.getHexLeaves(),
      },
      null,
      2
    )
  );
};

main();
