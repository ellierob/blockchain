require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: 
  { compilers: [
    {version: "0.6.6",},
    {version: 
      "0.8.17",
    settings: {},}
  ]},
  networks: {
    hardhat: {
      forking: {
        url: process.env.ALCHEMY_MAINNET_RPC_URL
      }
    }
  }
};
