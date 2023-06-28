// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";

contract BBS {
    address public owner;
    uint256 public latestPostId;
    address[] public postOwners; // Index is postId - 1

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOthers(uint256 postId) {
        require(postId <= latestPostId, "Post does not exist");
        require(msg.sender != postOwners[postId - 1], "Only others can perform this action");
        _;
    }

    event Post(uint256 indexed postId, address indexed user, string text);
    event Reply(uint256 indexed postId, address indexed user, uint256 indexed parentPostId, string text);
    event Like(uint256 indexed postId, address indexed user);
    event Dislike(uint256 indexed postId, address indexed user);

    function post(string calldata text) external {
        latestPostId = _newPostId(msg.sender);

        emit Post(latestPostId, msg.sender, text);
    }

    function reply(uint256 parentPostId, string calldata text) external {
        latestPostId = _newPostId(msg.sender);

        emit Reply(latestPostId, msg.sender, parentPostId, text);
    }

    function _newPostId(address user) private returns (uint256) {
        latestPostId++;
        postOwners.push(user);
        return latestPostId;
    }

    function like(uint256 postId) external onlyOthers(postId) {
        emit Like(postId, msg.sender);
    }

    function dislike(uint256 postId) external onlyOthers(postId) {
        emit Dislike(postId, msg.sender);
    }
}
