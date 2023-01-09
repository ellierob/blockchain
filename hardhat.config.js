require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-waffle");
// require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("dotenv").config();
require("./tasks/block-number.js");
// require("hardhat-deploy");
require("hardhat-gas-reporter");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      // {version: "0.6.6",}, 
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
            details: { yul: false }
          }
        },
      }]
  },
  defaultNetwork: "hardhat",
  networks: {
    goerliAlchemy: {
      live: true,
      saveDeployments: true,
      deploy: ['deploy-goerliAlchemy/'],
      url: process.env.ALCHEMY_GOERLI_TESTNET_RPC_URL,
      chainId: 5,
      accounts: [process.env.TEST_PRIVATE_KEY],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      // accounts: [],
    },
    hardhat: {
      allowUnlimitedContractSize: true,
      forking: {
        url: process.env.ALCHEMY_GOERLI_TESTNET_RPC_URL,
        accounts: [process.env.TEST_PRIVATE_KEY],
        chainId: 5,
      }
    }
  },
  // namedAccounts: {
  //   deployer: {
  //     default: 0,

  //   }
  // },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    // outputFile: "gas-report.txt",
    noColours: true,
    currency: "BDT",
    coinmarketcap: process.env.COINMARKETCAP_API_KEY,
  }
};
