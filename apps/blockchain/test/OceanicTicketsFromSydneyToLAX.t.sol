// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../lib/forge-std/src/Test.sol";
import "../src/OceanicTicketsFromSydneyToLAX.sol";

contract OceanicTicketsFromSydneyToLAXTest is Test {
    OceanicTicketsFromSydneyToLAX ticketContract;
    function setUp() public {
        ticketContract = new OceanicTicketsFromSydneyToLAX();
    }

    function testExample() public {
        assertTrue(true);
    }
}
