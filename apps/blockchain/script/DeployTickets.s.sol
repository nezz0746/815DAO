// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../lib/forge-std/src/Script.sol";
import "../src/OceanicTicketsFromSydneyToLAX.sol";

contract DeployTickets is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        new OceanicTicketsFromSydneyToLAX(
            bytes32(
                0x99686be0a227274179fed1183709d9086ce354553c4f3ad049e7af1df5db3f87
            ),
            "ipfs://bafybeighzakj3xuignhulz456hbvtb6tt6jlhw4vrf4x4er2o7kxeu27ym"
        );

        vm.stopBroadcast();
    }
}
