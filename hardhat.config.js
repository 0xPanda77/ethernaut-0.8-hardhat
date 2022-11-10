require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.5.5",
      },
      {
        version: "0.8.17",
      },
    ],
    overrides: {
      "contracts/19_AlienCodex.sol": {
        version: "0.5.5",
        settings: {},
      },
    },
  },
};
