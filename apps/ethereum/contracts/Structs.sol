//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.14;

library Structs {
    struct FlightInformation {
        uint256 timeOfDeparture;
        uint256 gateNumber;
        string aircraftType;
        uint256 capacity;
        string captain;
    }
}
