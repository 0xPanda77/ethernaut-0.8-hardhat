// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./26_DoubleEntryPoint.sol";

contract DetectionBot {
    IForta forta;
    address private cryptoVaultAddr;

    constructor(address _fortaAddr, address _cryptoVaultAddr) public {
      forta = IForta(_fortaAddr);
      cryptoVaultAddr = _cryptoVaultAddr;
    }

    function handleTransaction(address user, bytes calldata msgData) public {
      (address to, uint256 value, address origSender) = abi.decode(msgData[4:], (address, uint256, address));
      if(origSender == cryptoVaultAddr) {
          forta.raiseAlert(user);
      }
    }

}