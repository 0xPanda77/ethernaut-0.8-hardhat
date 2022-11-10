const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

This instance represents a Good Samaritan that is wealthy and ready to donate some coins to anyone requesting it.

Would you be able to drain all the balance from his Wallet?

Things that might help:

Solidity Custom Errors

*/

describe("[Challenge] Good Samaritan", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.goodSamaritan = await (
      await ethers.getContractFactory("GoodSamaritan", deployer)
    ).deploy();
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */
    //
    this.goodSamaritanAttack = await (
      await ethers.getContractFactory("GoodSamaritanAttack", attacker)
    ).deploy(this.goodSamaritan.address);

    await this.goodSamaritanAttack.connect(attacker).attack();
  });

  after(async function () {
    /** SUCCESS CONDITIONS */
    const coinAddr = await this.goodSamaritan.coin();
    const walletAddr = await this.goodSamaritan.wallet();

    this.coin = await (
      await ethers.getContractFactory("Coin")
    ).attach(coinAddr);
    const bal = await this.coin.balances(walletAddr);
    expect(bal.toString()).to.eq("0");
  });
});
