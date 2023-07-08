// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./BBS.sol";
import "hardhat/console.sol";

contract TipBBS is BBS {
    event Tipped(uint256 indexed postId, address indexed user, uint256 value);

    function likeWithTip(uint256 postId) external payable postExistsAndNotOwner(postId) {
        require(msg.value > 0, "Must send Ether to like a post with a tip");

        _setLikeState(postId, msg.sender, LIKE);
        payable(posts[postId].owner).transfer(msg.value);

        emit Liked(postId, msg.sender);
        emit Tipped(postId, msg.sender, msg.value);
    }
}
