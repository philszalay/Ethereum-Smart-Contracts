// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.3;

import "./ERC20DappsUniverseFixedSupply.sol";

contract DappsUniverseTokenFactory {

    address[] internal erc20DappsUniverseFixedSupplyAddresses;

    function getERC20DappsUniverseFixedSupplyAddresses() view public returns(address[] memory) {
        return erc20DappsUniverseFixedSupplyAddresses;
    }

    function createERC20DappsUniverseFixedSupply(uint256 _supply, string memory _name, string memory _symbol) external {
        ERC20DappsUniverseFixedSupply erc20DappsUniverseFixedSupply = new ERC20DappsUniverseFixedSupply(_supply, _name, _symbol, msg.sender);
        erc20DappsUniverseFixedSupplyAddresses.push(address(erc20DappsUniverseFixedSupply));
    }
}