// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./18_MagicNum.sol";

interface Solver {
  function whatIsTheMeaningOfLife() external view returns (bytes32);
}

contract MagicNumFactory {
  bool public solved;

  function validateInstance(address payable _instance) public returns (bool) {
    // Retrieve the instance.
    MagicNum instance = MagicNum(_instance);

    // Retrieve the solver from the instance.
    Solver solver = Solver(instance.solver());
    
    // Query the solver for the magic number.
    bytes32 magic = solver.whatIsTheMeaningOfLife();
    
    if(magic != 0x000000000000000000000000000000000000000000000000000000000000002a) return false;
    
    // Require the solver to have at most 10 opcodes.
    uint256 size;
    assembly {
      size := extcodesize(solver)
    }
    if(size > 10) return false;
    
    solved = true;
    return true;
  }
}