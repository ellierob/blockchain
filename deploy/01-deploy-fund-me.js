const { devNets, networkConfig } = require("../helper-hardhat-config");
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

        let priceFeed;

        if (devNets.includes(network.name)) {
            log("local network detected! getting mocks price feed");
            const aggregator = await deployments.get("MockV3Aggregator");
            priceFeed = aggregator.address;
        } else {
            priceFeed = networkConfig[chainId].ethUsdPriceFeed;
        }


        const contract = await deploy(
            "FundMe",
            {
                from: deployer,
                args: [priceFeed],
                log: true,
            }
        )
    }

module.exports.tags = ["all", "fundMe"];