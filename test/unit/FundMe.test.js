// require("@nomiclabs/hardhat-waffle");

const { expect, assert } = require("chai");
const { ethers, deployments, getNamedAccounts } = require("hardhat");
// const { console } = require("hardhat/console");

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

            const priceFeedinFundMe = await fundMe.getPriceFeed();

            const expectedValue = mockV3Aggregator.address;

            assert.equal(priceFeedinFundMe, expectedValue);
            // expect(Num.toString()).to.equal(expectedValue);
        });
    })


    const sendValue =
        // ethers.utils.parseEther("1");
        "1000000000000000";

    describe("fun", async () => {

        it("should fail to fund without amount", async () => {
            await expect(fundMe.fund()).to.be.revertedWith(
                "More ETH required"
            )
        });

        it("should succeed to fund with enough eth", async () => {
            await fundMe.fund({
                value: sendValue,
                // gaslimit: "1000000000",
            });
            const recorded = await fundMe.getFunderToAmo(deployer);

            assert.equal(sendValue.toString(), recorded.toString());
        });

        it("should succeed to withdraw from multiple accounts", async () => {

            const accounts = await ethers.getSigners();

            for (i = 1; i < 6; i++) {
                const fundMeFunder = await fundMe.connect(accounts[i]);

                await fundMeFunder.fund({
                    value: sendValue,
                    // gaslimit: "1000000000",
                });
            }
            const startingFundMeBalance =
                await fundMe.provider.getBalance(fundMe.address)
            const startingDeployerBalance =
                await fundMe.provider.getBalance(deployer)

            // Act
            const transactionResponse = await fundMe.wdraw()
            // Let's comapre gas costs :)
            // const transactionResponse = await fundMe.wdraw()
            const transactionReceipt = await transactionResponse.wait()

            const {
                // cumulativeGasUsed
                gasUsed,
                effectiveGasPrice
            } = transactionReceipt
            const withdrawGasCost = gasUsed.mul(effectiveGasPrice)
            console.log(`GasCost: ${withdrawGasCost}`)
            console.log(`GasUsed: ${gasUsed}`)
            console.log(`GasPrice: ${effectiveGasPrice}`)

            const endingFundMeBalance = await fundMe.provider.getBalance(
                fundMe.address
            )

            assert.equal(endingFundMeBalance.toString(), "0");

            const endingDeployerBalance =
                await fundMe.provider.getBalance(deployer)
            // Assert
            assert.equal(
                startingFundMeBalance
                    .add(startingDeployerBalance)
                    .toString(),
                endingDeployerBalance.add(withdrawGasCost).toString()
            )
            // Make a getter for storage variables
            // await expect(fundMe.getFunder(0)).to.be.reverted

            for (i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.getFunderToAmo(
                        accounts[i].address
                    ),
                    0
                )
            }
        })

        it("Only allows the owner to withdraw", async function () {
            const accounts = await ethers.getSigners()
            const fundMeConnectedContract = await fundMe.connect(
                accounts[1]
            )
            await expect(
                fundMeConnectedContract.wdraw()
                // ).to.be.revertedWith("FundMe__NotOwner");
            ).to.be.reverted;
        })
    })

})