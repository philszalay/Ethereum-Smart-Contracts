// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.5.16;

contract Owned {
    address public owner;

    // constructor
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
}