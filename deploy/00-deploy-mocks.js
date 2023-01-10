const { devNets, DECIMALS, INITIAL_ANSWER } = require("../helper-hardhat-config");
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
        // const chainId = network.config.chainId;

        // const priceFeed = networkConfig[chainId].ethUsdPriceFeed;

        // const contract = await deploy(
        //     "FundMe",
        //     {
        //         from: deployer,
        //         args: [priceFeed],
        //         log: true,
        //     }
        // )

        log(network.name, devNets);
        log(devNets.includes(network.name));

        if (devNets.includes(network.name)) {
            log("local network detected! deploying mocks...");
            contract = await deploy(
                "MockV3Aggregator",
                {
                    contract: "MockV3Aggregator",
                    from: deployer,
                    args: [DECIMALS, INITIAL_ANSWER],
                    log: true,
                }
            );

            log("Mocks deployed");
            log("----------------------------");
        }
    }

module.exports.tags = ["all", "mocks", "mockFundMe"];