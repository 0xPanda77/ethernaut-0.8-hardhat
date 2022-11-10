const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

This gatekeeper introduces a few new challenges. Register as an entrant to pass this level.

Things that might help:
- Remember what you've learned from getting past the first gatekeeper - the first gate is the same.
- The assembly keyword in the second gate allows a contract to access functionality that is not native to vanilla Solidity. See here for more information. The extcodesize call in this gate will get the size of a contract's code at a given address - you can learn more about how and when this is set in section 7 of the yellow paper.
- The ^ character in the third gate is a bitwise operation (XOR), and is used here to apply another common bitwise operation (see here). The Coin Flip level is also a good place to start when approaching this challenge.

*/

describe("[Challenge] Gatekeeper Two", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.gatekeeperTwo = await (
      await ethers.getContractFactory("GatekeeperTwo", deployer)
    ).deploy();
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */

    // gate 2
    // extcodesize == 0 => code in constructor only

    // gate 3
    // XOR - A ^ B = C then A ^ C = B
    // uint64 key = uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ type(uint64).max;

    this.gatekeeperTwoAttack = await (
      await ethers.getContractFactory("GatekeeperTwoAttack", attacker)
    ).deploy(this.gatekeeperTwo.address);
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    const entrant = await this.gatekeeperTwo.entrant();
    expect(entrant).to.eq(attacker.address);
  });
});
