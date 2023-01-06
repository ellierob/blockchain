require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-waffle");
// require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: { 
    compilers: [{
      version: "0.6.6",
    },{
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
          details: {yul: false}
        }
      },
    }]
  },
  networks: {
    goerliAlchemy :{
      live: true,
      saveDeployments: true,
      deploy: ['deploy-goerliAlchemy/'],
      url: process.env.ALCHEMY_GOERLI_TESTNET_RPC_URL,
      accounts: [process.env.TEST_PRIVATE_KEY]
    },
    hardhat: {
      allowUnlimitedContractSize: true,
      forking: {
        url: process.env.ALCHEMY_GOERLI_TESTNET_RPC_URL,
        accounts: [process.env.TEST_PRIVATE_KEY]
      }
    }
  }
};
