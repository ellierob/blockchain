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

    const sendValue =
        // ethers.utils.parseEther("1");
        "10000000000000000";

    // const accounts = await ethers.getSigners();
    const funder = (await ethers.getSigners())[1];

    console.log("funder:", funder.address);

    const startingFundMeBalance =
        await fundMe.provider.getBalance(fundMe.address)
    const startingFunderBalance =
        await fundMe.provider.getBalance(funder.address)

    const fundMeFunder = await fundMe.connect(
        // accounts[1],
        funder,
    );

    await fundMeFunder.fund({
        value: sendValue,
        // gaslimit: "1000000000",
    });

    const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
    )
    const endingFunderBalance =
        await fundMe.provider.getBalance(funder.address)

    console.log("starting fundMe balance:", startingFundMeBalance.toString());
    console.log("starting funder Balance:", startingFunderBalance.toString());
    console.log("ending FundMe Balance:", endingFundMeBalance.toString());
    console.log("ending funder Balance:", endingFunderBalance.toString());

}

main()
    .then(() => process.exit(0))
    .catch((er) => {
        console.log(`error:`, er.message);
    });