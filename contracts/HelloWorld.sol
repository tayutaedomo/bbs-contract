// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract HelloWorld {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function hello() pure public returns (string memory) {
        return "Hello, World!";
    }
}
