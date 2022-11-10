const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

The goal of this level is for you to steal all the funds from the contract.

  Things that might help:

- Untrusted contracts can execute code where you least expect it.
- Fallback methods
- Throw/revert bubbling
- Sometimes the best way to attack a contract is with another contract.
- See the Help page above, section "Beyond the console"

*/

describe("[Challenge] Reentrance", function () {
  let deployer, attacker;

  const INITIAL_ETH_DEPOSIT = ethers.utils.parseEther("0.001");
  const ATTACKER_ETH_DEPOSIT = ethers.utils.parseEther("0.001");

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.reentrance = await (
      await ethers.getContractFactory("Reentrance", deployer)
    ).deploy();

    // deployer donate some eth
    await this.reentrance.donate(deployer.address, {
      value: INITIAL_ETH_DEPOSIT,
    });

    const deployerBalance = await this.reentrance.balanceOf(deployer.address);
    expect(deployerBalance).to.eq(INITIAL_ETH_DEPOSIT);

    const contractBalance = await ethers.provider.getBalance(
      this.reentrance.address
    );
    expect(contractBalance).to.eq(INITIAL_ETH_DEPOSIT);
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */
    this.reentranceAttack = await (
      await ethers.getContractFactory("ReentranceAttack", attacker)
    ).deploy(this.reentrance.address);

    await this.reentranceAttack
      .connect(attacker)
      .attack({ value: ATTACKER_ETH_DEPOSIT, gasLimit: 1e6 });

    // fail because
    // balances[msg.sender] -= _amount;
    // cannot underflow in solidity 0.8
  });

  after(async function () {
    /** SUCCESS CONDITIONS */
    const contractBalance = await ethers.provider.getBalance(
      this.reentrance.address
    );
    expect(contractBalance).to.eq(ethers.utils.parseEther("0"));
  });
});
