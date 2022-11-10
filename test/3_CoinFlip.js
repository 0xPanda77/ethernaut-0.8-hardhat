const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

This is a coin flipping game where you need to build up your winning streak by guessing the outcome of a coin flip. To complete this level you'll need to use your psychic abilities to guess the correct outcome 10 times in a row.

  Things that might help

- See the Help page above, section "Beyond the console"

*/

describe("[Challenge] CoinFlip", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.coinFlip = await (
      await ethers.getContractFactory("CoinFlip", deployer)
    ).deploy();
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */

    this.coinFlipAttack = await (
      await ethers.getContractFactory("CoinFlipAttack", attacker)
    ).deploy(this.coinFlip.address);

    for (let i = 0; i < 10; i++) {
      await this.coinFlipAttack.connect(attacker).flip();
    }
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    // consecutiveWins = 10
    expect(await this.coinFlip.consecutiveWins()).to.eq(10);
  });
});
