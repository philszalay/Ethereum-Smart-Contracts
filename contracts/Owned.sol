// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.3;

contract Owned {
    address public owner;

    // constructor
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}