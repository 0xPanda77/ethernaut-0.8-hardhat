const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

You've uncovered an Alien contract. Claim ownership to complete the level.

  Things that might help

- Understanding how array storage works
- Understanding ABI specifications
- Using a very underhanded approach

*/

describe("[Challenge] Alien Codex", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.alienCodex = await (
      await ethers.getContractFactory("AlienCodex", deployer)
    ).deploy();
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */

    // const slot0 = await ethers.provider.getStorageAt(this.alienCodex.address, 0);
    // 0x000000000000000000000001xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    // address private _owner; - from Ownable Contract
    // bool public contact; - from AlienCodex Contract
    // where the x = owner address and 1 = contact bool

    // const slot1 = await ethers.provider.getStorageAt(this.alienCodex.address, 1);
    // bytes32[] public codex;
    // numbers of elements in dynamic array - should be max because of underflow
    // 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff

    // dynamic array position
    // keccak256(slot) + index

    // position 0: keccak256(1) + 0

    // position MAX: keccak256(1) + 2^256 => will overflow

    // to find position equivalent to slot0
    // 2^256 - keccak256(1)

    // update dynamic array at slot0 position to change owner

    // Exploit by contract
    this.alienCodexAttack = await (
      await ethers.getContractFactory("AlienCodexAttack", deployer)
    ).deploy();

    await this.alienCodexAttack
      .connect(attacker)
      .attack(this.alienCodex.address);
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    const alienOwner = await this.alienCodex.owner();
    expect(alienOwner).to.eq(attacker.address);
  });
});
