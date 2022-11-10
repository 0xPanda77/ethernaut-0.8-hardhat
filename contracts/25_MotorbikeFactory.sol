// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Address.sol";

contract MotorbikeFactory {
  bool public validate;
  function validateInstance(address payable _instance) public returns (bool) {
    if (!Address.isContract(_instance)) validate = true;
    return !Address.isContract(_instance);
  }
}