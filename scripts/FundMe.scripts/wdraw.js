const { ethers, deployments, getNamedAccounts } = require("hardhat");

async function main() {
    const deployer = (await getNamedAccounts()).deployer;

    console.log("deployer:", deployer);

    // @dev hardhat-deploy deploys contract by tag
    // await deployments.fixture(["mockFundMe"]);

    const fundMe = await ethers.getContract(
        "FundMe",
        deployer
    );

    const startingFundMeBalance =
        await fundMe.provider.getBalance(fundMe.address)
    const startingDeployerBalance =
        await fundMe.provider.getBalance(deployer)

    await (await fundMe.wdraw()).wait();

    const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
    )
    const endingDeployerBalance =
        await fundMe.provider.getBalance(deployer)

    console.log("starting fundMe balance:", startingFundMeBalance.toString());
    console.log("starting Deployer Balance:", startingDeployerBalance.toString());
    console.log("ending FundMe Balance:", endingFundMeBalance.toString());
    console.log("ending Deployer Balance:", endingDeployerBalance.toString());
}

main()
    .then(() => process.exit(0))
    .catch((er) => {
        console.log(`error:`, er.message);
    });