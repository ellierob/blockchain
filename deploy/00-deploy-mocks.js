const { networkConfig } = require("../helper-hardhat-config");
const { network } = require("hardhat");

module.exports =
    async (
        // when hardhat calls it
        // it passes hre as argument
        // hre
        { getNamedAccounts, deployments }
    ) => {
        console.log(`deploying`);

        const { deploy, log } = deployments;
        const { deployer } = await getNamedAccounts();
        const chainId = network.config.chainId;

        const priceFeed = networkConfig[chainId].ethUsdPriceFeed;

        const contract = await deploy(
            "FundMe",
            {
                from: deployer,
                args: [priceFeed],
                log: true,
            }
        )
    }