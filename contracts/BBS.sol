// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract BBS {
    address public owner;

    constructor() {
        owner = msg.sender;
    }
}
