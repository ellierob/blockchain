// require("@nomiclabs/hardhat-waffle");

const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("store", function () {
    let contractFactory, contract;

    beforeEach(async function () {
        contractFactory = await ethers.getContractFactory("Stored");
        contract = await contractFactory.deploy();
    })

    it("should be initialized with 0", async () => {

        const Num = await contract.Num();

        const expectedValue = 0;

        assert.equal(Num.toString(), expectedValue);
        // expect(Num.toString()).to.equal(expectedValue);
    });

    it.only("should update", async () => {

        const txResp = await contract.store(4);
        await txResp.wait(1);

        const currentValue = await contract.Num();

        const expectedValue = 4;

        assert.equal(currentValue.toString(), expectedValue);
        // expect.equal(Num, expectedValue);
    });

})