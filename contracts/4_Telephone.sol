// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract Telephone {

  address public owner;

  constructor() public {
    owner = msg.sender;
  }

  function changeOwner(address _owner) public {
    //tx.origin = attacker; msg.sender = attack contract
    if (tx.origin != msg.sender) {
      owner = _owner;
    }
  }
}