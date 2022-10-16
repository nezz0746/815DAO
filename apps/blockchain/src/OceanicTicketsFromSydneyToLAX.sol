//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.14;

import "../lib/openzeppelin-contracts/contracts/utils/Counters.sol";
import "../lib/openzeppelin-contracts/contracts/utils/cryptography/MerkleProof.sol";
import "../lib/openzeppelin-contracts/contracts/token/ERC721/ERC721.sol";
import "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";
import "../lib/openzeppelin-contracts/contracts/utils/Base64.sol";
import "../lib/openzeppelin-contracts/contracts/utils/Strings.sol";

import {Errors} from "./Errors.sol";
import {Structs} from "./Structs.sol";

contract OceanicTicketsFromSydneyToLAX is ERC721, Ownable {
    bytes32 public manifest;
    uint128 clickerCounter = 0;
    uint256 public ticketPrice = 8150000000000000;
    string baseURI;
    mapping(address => bool) claimed;

    Structs.FlightInformation public flight;

    constructor(bytes32 _manifest, string memory _uri)
        ERC721("SYDLAXTicket", "SYDLAX")
    {
        manifest = _manifest;
        baseURI = _uri;
        flight = Structs.FlightInformation(
            1095855300,
            23,
            "Boeing 777",
            361,
            "Seth Norris"
        );
    }

    // =============== MODIFIERS ====================

    modifier whenTicketPriceMet() {
        if (ticketPrice > msg.value) revert Errors.ticketPriceNotMet();
        _;
    }

    modifier whenBookerPassenger(address _passenger) {
        if (tx.origin != msg.sender || _passenger != msg.sender)
            revert Errors.bookerNotPassenger();
        _;
    }

    // =============== GOING BACK ====================

    function book(address passenger, bytes32[] calldata onlineCheckIn)
        public
        payable
        whenTicketPriceMet
        whenBookerPassenger(passenger)
    {
        if (claimed[passenger] == true) revert Errors.alreadyClaimed();

        if (
            MerkleProof.verify(
                onlineCheckIn,
                manifest,
                keccak256(abi.encodePacked(passenger))
            ) == false
        ) revert Errors.passengerNotOnFlightManifest();

        claimed[passenger] = true;
        clickerCounter += 1;
        _safeMint(passenger, _assignSeat(clickerCounter));
    }

    function _assignSeat(uint128 id) private view returns (uint256) {
        return ((id / flight.capacity) << 128) + (id % flight.capacity);
    }

    // ============== OWNER FUNCTIONS ==============

    function setBaseURI(string memory newURI) external onlyOwner {
        baseURI = newURI;
    }

    // ===============OVERRIDES ==================

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return baseURI;
    }
}
