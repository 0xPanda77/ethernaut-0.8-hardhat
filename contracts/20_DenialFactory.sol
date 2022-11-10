// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './20_Denial.sol';

contract DenialFactory {

  bool public validate;

  function validateInstance(address payable _instance) public returns (bool) {
    
    Denial instance = Denial(_instance);
    if (address(instance).balance <= 100 wei) { // cheating otherwise
        return false;
    }
    // fix the gas limit for this call
    (bool result,) = address(instance).call{gas:1000000}(abi.encodeWithSignature("withdraw()")); // Must revert

    if (!result) {
      validate = true;
    }
    return !result;
  }

  receive() external payable {}

}