const { ethers } = require("hardhat");
const { expect } = require("chai");

/*

Сan you get the item from the shop for less than the price asked?

Things that might help:
- Shop expects to be used from a Buyer
- Understanding restrictions of view functions

*/

describe("[Challenge] Shop", function () {
  let deployer, attacker;

  before(async function () {
    /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
    [deployer, attacker] = await ethers.getSigners();

    this.shop = await (
      await ethers.getContractFactory("Shop", deployer)
    ).deploy();
  });

  it("Exploit", async function () {
    /** CODE YOUR EXPLOIT HERE */

    this.shopAttack = await (
      await ethers.getContractFactory("ShopAttack", attacker)
    ).deploy(this.shop.address);

    await this.shopAttack.attack();
  });

  after(async function () {
    /** SUCCESS CONDITIONS */
    const isSold = await this.shop.isSold();
    const price = await this.shop.price();

    expect(isSold).to.eq(true);
    expect(price).to.lt(100);
  });
});
