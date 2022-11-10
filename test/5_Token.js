const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

The goal of this level is for you to hack the basic token contract below.

You are given 20 tokens to start with and you will beat the level if you somehow manage to get your hands on any additional tokens. Preferably a very large amount of tokens.

  Things that might help:

- What is an odometer?

*/

describe("[Challenge] Token", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */
    // Pass a value > 20, first require statement will underflow
    // Overflow/Underflow issue of uint is fixed in solidity version >= 0.8
  });

  after(async function () {
    /** SUCCESS CONDITIONS */
  });
});
