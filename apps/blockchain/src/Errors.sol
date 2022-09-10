//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.14;

library Errors {
    error passengerNotOnFlightManifest();
    error ticketPriceNotMet();
    error bookerNotPassenger();
}
