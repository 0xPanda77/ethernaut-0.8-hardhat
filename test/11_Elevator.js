const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

This elevator won't let you reach the top of your building. Right?

Things that might help:
Sometimes solidity is not good at keeping promises.
This Elevator expects to be used from a Building.


*/

describe("[Challenge] Elevator", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.elevator = await (
      await ethers.getContractFactory("Elevator", deployer)
    ).deploy();

    const top = await this.elevator.top();
    expect(top).to.eq(false);
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */

    this.elevatorAttack = await (
      await ethers.getContractFactory("ElevatorAttack", attacker)
    ).deploy(this.elevator.address);

    await this.elevatorAttack.connect(attacker).attack();
  });

  after(async function () {
    /** SUCCESS CONDITIONS */
    const top = await this.elevator.top();
    expect(top).to.eq(true);
  });
});
