// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Not minable, fixed ammount of token that is generated on deployment.
contract DappsUniverseFixedSupply is ERC20 {

    uint256 internal constant _supply = 100;

    constructor() ERC20("DappsUniverseFixedSupply", "DUFS") {
        _mint(msg.sender, _supply*10**decimals());
    }
}