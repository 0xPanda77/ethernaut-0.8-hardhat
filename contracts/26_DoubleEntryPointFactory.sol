// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './26_DoubleEntryPoint.sol';

contract DoubleEntryPointFactory {
  bool public validate;
  function validateInstance(address payable _instance, address _player) public returns (bool) {
    DoubleEntryPoint instance = DoubleEntryPoint(_instance);
    Forta forta = instance.forta();

    // If user didn't set an DetectionBot, level failed.
    address usersDetectionBot = address(forta.usersDetectionBots(_player));
    if(usersDetectionBot == address(0)) return false;

    address vault = instance.cryptoVault();
    CryptoVault cryptoVault = CryptoVault(vault);
    
    (bool ok, bytes memory data) = this.__trySweep(cryptoVault, instance);
    
    require(!ok, "Sweep succeded");

    bool swept = abi.decode(data, (bool));
    if (swept) validate = true;
    return swept;
  }

  function __trySweep(CryptoVault cryptoVault, DoubleEntryPoint instance) external returns(bool, bytes memory) {
    try cryptoVault.sweepToken(IERC20(instance.delegatedFrom())) {
      return(true, abi.encode(false));
    } catch {
      return(false, abi.encode(instance.balanceOf(instance.cryptoVault()) > 0));
    }
  }
}