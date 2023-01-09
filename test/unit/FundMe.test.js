// require("@nomiclabs/hardhat-waffle");

const { expect, assert } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");

describe("FundMe", function () {
    let deployer, fundMe, mockV3Aggregator;

    beforeEach(async function () {

        deployer = (await getNamedAccounts()).deployer;

        // @dev hardhat-deploy deploys contract by tag
        await deployments.fixture(["all"]);

        // hardhat deploy gets recently deployed contract
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        );
        fundMe = await ethers.getContract(
            "FundMe",
            deployer
        );
    })

    describe("constructor", async function () {
        it("sets the address correctly", async () => {

            const priceFeedinFundMe = await fundMe.priceFeed();

            const expectedValue = mockV3Aggregator.address;

            assert.equal(priceFeedinFundMe, expectedValue);
            // expect(Num.toString()).to.equal(expectedValue);
        });
    })

    describe("fun", async () => {

        it("should fail to fund without amount", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "More ETH required"
            )
        });

        it("should succeed to fund with enough eth", async () => {
            const sendValue =
                // ethers.utils.parseEther("1");
                "1000000000000000"
            await fundMe.fund({
                value: sendValue,
                // gaslimit: "1000000000",
            });
            const recorded = await fundMe.funderToAmo(deployer);

            assert.equal(sendValue.toString(), recorded.toString());

        });
    })

})