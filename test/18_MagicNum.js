const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

To solve this level, you only need to provide the Ethernaut with a Solver, a contract that responds to whatIsTheMeaningOfLife() with the right number.

Easy right? Well... there's a catch.

The solver's code needs to be really tiny. Really reaaaaaallly tiny. Like freakin' really really itty-bitty tiny: 10 opcodes at most.

Hint: Perhaps its time to leave the comfort of the Solidity compiler momentarily, and build this one by hand O_o. That's right: Raw EVM bytecode.

Good luck!

*/

describe("[Challenge] Magic Num", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.magicNum = await (
      await ethers.getContractFactory("MagicNum", deployer)
    ).deploy();
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */
    /*
    Smart Contract consist of 2 sets of opcodes:
    - Initialization opcodes
    - Runtime opcodes

    To solve this challenge

    ** Runtime opcodes **
    - to return 42 in Runtime opcodes under 10 opcodes.

        1. First, store 42 in memory with `mstore(p, v)`, where p is position and v is the value in hexadecimal:

        602a    // v: push1 0x2a (value is 42 = 0x2a)
        6050    // p: push1 0x50 (memory slot is 0x50)
        52      // mstore

        2. return this value
        6020    // s: push1 0x20 (value(size): 32 bytes = 0x20 )
        6050    // p: push1 0x50 (position:  0x50)
        f3      // return

        602a60505260206050f3

    ** Initialization opcodes **
        3. copy runtime opcodes in memory before returning them to the EVM
        `codecopy(t,f,s)`, where
        t: the destination position of the code, in memory. Let’s arbitrarily save the code to the 0x00 position.
        f: the current position of the runtime opcodes, in reference to the entire bytecode. Remember that f starts after initialization opcodes end. Unknown for now.
        s: size of the code (10 bytes)

        600a    // s: push1 0x0a (10 bytes)
        60??    // f: push1 0x?? (current position of runtime opcodes)
        6000    // t: push1 0x00 (destination memory index 0)
        39      // CODECOPY

        4. return your in-memory runtime opcodes to the EVM:
        600a    // s: push1 0x0a (runtime opcode length)
        6000    // p: push1 0x00 (access memory index 0)
        f3      // return to EVM

        600a60??600039600a6000f3

        5. Notice the initialization opcodes take up 12 bytes (0x0c) spaces. => ?? = 0c

        600a600c600039600a6000f3

    Final Hack Contract opcodes

    0x600a600c600039600a6000f3602a60505260206050f3

    */

    const opcodes = "0x600a600c600039600a6000f3602a60505260206050f3";
    // const opcodes = "0x600a600c600039600a6000f3602a60005260206000f3";
    const result = await attacker.sendTransaction({
      data: opcodes,
    });
    const tx = await result.wait();
    this.hackContractAddress = tx.contractAddress;

    await this.magicNum.connect(attacker).setSolver(this.hackContractAddress);
  });

  after(async function () {
    /** SUCCESS CONDITIONS */

    this.magicNumFactory = await (
      await ethers.getContractFactory("MagicNumFactory", deployer)
    ).deploy();
    await this.magicNumFactory.validateInstance(this.magicNum.address);
    const solved = await this.magicNumFactory.solved();
    expect(solved).to.eq(true);
  });
});
