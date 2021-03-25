// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.3;

import "./SafeMath.sol";

contract MathExamples {
    using SafeMath for uint256;

    /**
     * Use pure keyword to indicate that the function will not alter the storage stage in any way
     * and it also will not read anything from the storage
     */
    function divideNumberByFour(uint256 _a) public pure returns (uint256) {
        return _a.div(4);
    }
}