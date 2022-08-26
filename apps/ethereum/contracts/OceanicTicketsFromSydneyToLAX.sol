//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import {Errors} from "./Errors.sol";
import {Structs} from "./Structs.sol";

contract OceanicTicketsFromSydneyToLAX is ERC721, Ownable {
    bytes32 public manifest;
    uint128 clickerCounter = 0;
    uint256 ticketPrice = 8150000000000000;
    string baseURI;

    Structs.FlightInformation public flight;

    constructor() ERC721("SYDLAXTicket", "SYDLAX") {
        flight = Structs.FlightInformation(
            1095855300,
            23,
            "Boeing 777",
            361,
            "Seth Norris"
        );
    }

    // IDEA/TODO: Override tokenURI to render SVG ticket with flight information & seat nbr

    function book(address passenger, bytes32[] memory onlineCheckIn)
        public
        payable
    {
        if (ticketPrice != msg.value) revert Errors.ticketPriceNotMet();
        if (passenger != msg.sender) revert Errors.bookerNotPassenger();

        if (
            MerkleProof.verify(
                onlineCheckIn,
                manifest,
                keccak256(abi.encodePacked(passenger))
            )
        ) revert Errors.passengerNotOnFlightManifest();

        clickerCounter += 1;
        _safeMint(passenger, _assignTicketNumber(clickerCounter));
    }

    function _assignTicketNumber(uint128 id) private view returns (uint256) {
        return ((id / flight.capacity) << 128) + (id % flight.capacity);
    }

    function setBaseURI(string memory newURI) external onlyOwner {
        baseURI = newURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }
}
