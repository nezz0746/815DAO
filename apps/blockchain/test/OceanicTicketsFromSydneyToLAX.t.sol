// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "../src/OceanicTicketsFromSydneyToLAX.sol";

import "../lib/murky/src/Merkle.sol";

import "./utils/DSTestFull.sol";

contract Manifest is DSTestFull {
    Merkle public m = new Merkle();

    constructor() {}
}

contract OceanicTicketsFromSydneyToLAXTest is Manifest {
    OceanicTicketsFromSydneyToLAX ticketContract;
    uint256 price;
    address customer;
    bytes32[] proof;

    function setUp() public {
        bytes32 root = 0x99686be0a227274179fed1183709d9086ce354553c4f3ad049e7af1df5db3f87;

        customer = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;

        proof = new bytes32[](3);
        proof[
            0
        ] = 0xe600249a99bdb3c1257a0f0929b3993b3106be30e808066fd3cb253f8d228541;
        proof[
            1
        ] = 0xf858e30cef9d4f45e0ebd2c99e7f52af994399e2e049212a3fd60eaa8027de79;
        proof[
            2
        ] = 0xbecb9f047558833abf2232dfb072441add72c9880919f7d026368635b76520f8;

        ticketContract = new OceanicTicketsFromSydneyToLAX(root, "");

        price = ticketContract.ticketPrice();
    }

    function testBook() public {
        prankAs(customer);
        ticketContract.book{value: price}(customer, proof);
        assertEq(ticketContract.balanceOf(customer), 1);
    }

    function testCannotBookIfNotOnManifest() public {
        address ethan = labelAndPrank("ethan");
        vm.expectRevert(Errors.passengerNotOnFlightManifest.selector);
        ticketContract.book{value: price}(ethan, proof);
    }

    function testCannotUseSomeoneElsesTicket() public {
        labelAndPrank("charlesWidmore");
        vm.expectRevert(Errors.bookerNotPassenger.selector);
        ticketContract.book{value: price}(customer, proof);
    }
}
