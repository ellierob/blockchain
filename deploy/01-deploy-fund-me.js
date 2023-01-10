const { devNets, networkConfig } = require("../helper-hardhat-config");
const { network } = require("hardhat");
const verify = require("../utils/verify");

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
                waitConfirmations: network.config.blockConfirmations || 1,
            }
        )

        log('deployed fundme');

        if (
            !devNets.includes(network.name) &&
            process.env.ETHERSCAN_API_KEY
        ) {
            await verify(contract.address, [priceFeed]);
        }

        log('-------------------------');
    }

module.exports.tags = ["all", "fundMe", "mockFundMe"];