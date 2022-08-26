import { MerkleTree } from "merkletreejs";
import SHA256 from "crypto-js/sha256.js";
import jsontree from "./tree.json" assert { type: "json" };

const myAddress = "0x26bBec292e5080ecFD36F38FF1619FF35826b113".toLowerCase();

const leaf = SHA256(myAddress);

const tree = new MerkleTree(jsontree.leaves, SHA256);

const proof = tree.getProof(leaf);

const verified = tree.verify(proof, leaf, jsontree.root);

if (verified) {
  console.log("You are in the DAO!");
} else {
  console.log("You are not in the DAO!");
}
