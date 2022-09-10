// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../lib/forge-std/src/Script.sol";
import "../src/OceanicTicketsFromSydneyToLAX.sol";

contract ContractScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        new OceanicTicketsFromSydneyToLAX();

        vm.stopBroadcast();
    }
}
