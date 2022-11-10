const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

This level features a CryptoVault with special functionality, the sweepToken function. This is a common function used to retrieve tokens stuck in a contract. The CryptoVault operates with an underlying token that can't be swept, as it is an important core logic component of the CryptoVault. Any other tokens can be swept.

The underlying token is an instance of the DET token implemented in the DoubleEntryPoint contract definition and the CryptoVault holds 100 units of it. Additionally the CryptoVault also holds 100 of LegacyToken LGT.

In this level you should figure out where the bug is in CryptoVault and protect it from being drained out of tokens.

The contract features a Forta contract where any user can register its own detection bot contract. Forta is a decentralized, community-based monitoring network to detect threats and anomalies on DeFi, NFT, governance, bridges and other Web3 systems as quickly as possible. Your job is to implement a detection bot and register it in the Forta contract. The bot's implementation will need to raise correct alerts to prevent potential attacks or bug exploits.

Things that might help:

How does a double entry point work for a token contract?

*/

describe("[Challenge] Double Entry Point", function () {
  let deployer, attacker;
  const INITIAL_DEPOSIT = ethers.utils.parseEther("100");

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    // legacy token
    this.LGTToken = await (
      await ethers.getContractFactory("LegacyToken", deployer)
    ).deploy();

    this.forta = await (
      await ethers.getContractFactory("Forta", deployer)
    ).deploy();

    this.cryptoVault = await (
      await ethers.getContractFactory("CryptoVault", deployer)
    ).deploy(attacker.address);

    // underlying token
    this.DETToken = await (
      await ethers.getContractFactory("DoubleEntryPoint", deployer)
    ).deploy(
      this.LGTToken.address,
      this.cryptoVault.address,
      this.forta.address,
      attacker.address
    );

    await this.cryptoVault.setUnderlying(this.DETToken.address);

    await this.LGTToken.delegateToNewContract(this.DETToken.address);

    await this.LGTToken.mint(this.cryptoVault.address, INITIAL_DEPOSIT);
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */
    //
    // try sweep underlying token in cryptoVault
    // await this.cryptoVault.connect(attacker).sweepToken(this.LGTToken.address);
    // this will transfer all underlying tokens to sweptTokensRecipient

    // setup detection bot
    this.detectionBot = await (
      await ethers.getContractFactory("DetectionBot", attacker)
    ).deploy(this.forta.address, this.cryptoVault.address);

    // setDetectionBot
    await this.forta
      .connect(attacker)
      .setDetectionBot(this.detectionBot.address);
  });

  after(async function () {
    /** SUCCESS CONDITIONS */
    this.doubleEntryPointFactory = await (
      await ethers.getContractFactory("DoubleEntryPointFactory", attacker)
    ).deploy();
    await this.doubleEntryPointFactory.validateInstance(
      this.DETToken.address,
      attacker.address
    );
    const validate = await this.doubleEntryPointFactory.validate();
    expect(validate).to.eq(true);
  });
});
