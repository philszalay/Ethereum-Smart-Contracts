// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Not minable, fixed ammount of token that is generated on deployment.
contract ERC20DappsUniverseFixedSupply is ERC20 {
    constructor(uint256 _supply, string memory _name, string memory _symbol, address _sender) ERC20(_name, _symbol) {
        _mint(_sender, _supply*10**decimals());
    }
}