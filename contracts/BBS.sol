// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "hardhat/console.sol";

contract BBS {
    struct PostData {
        address owner;
        mapping(address => int8) likeStates; // user -> like state
    }

    uint256 public latestPostId;
    mapping(uint256 => PostData) public posts; // postId -> post data
    int8 constant LIKE = 1;
    int8 constant DISLIKE = -1;

    constructor() {}

    modifier postExistsAndNotOwner(uint256 postId) {
        require(postId <= latestPostId, "Post does not exist");
        require(msg.sender != posts[postId].owner, "Only others can perform this action");
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
        require(parentPostId <= latestPostId, "Parent post does not exist");

        latestPostId = _newPostId(msg.sender);

        emit Reply(latestPostId, msg.sender, parentPostId, text);
    }

    function _newPostId(address user) private returns (uint256) {
        latestPostId++;
        PostData storage newPost = posts[latestPostId];
        newPost.owner = user;
        return latestPostId;
    }

    function like(uint256 postId) external postExistsAndNotOwner(postId) {
        _setLikeState(postId, msg.sender, LIKE);
        emit Like(postId, msg.sender);
    }

    function dislike(uint256 postId) external postExistsAndNotOwner(postId) {
        _setLikeState(postId, msg.sender, DISLIKE);
        emit Dislike(postId, msg.sender);
    }

    function _setLikeState(uint256 postId, address user, int8 state) private {
        require(posts[postId].likeStates[user] == 0, "Like state is already set");

        posts[postId].likeStates[user] = state;
    }
}
