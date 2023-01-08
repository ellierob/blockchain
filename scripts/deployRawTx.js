// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");
const { ethers } = require("hardhat");
const fs = require("fs-extra");
// const ethers = require("ethers");

async function main() {

    const provider = new ethers.providers.JsonRpcProvider(
        // blockchain node: hardhat /ganache
        "http://127.0.0.1:8545"
    );

    const wallet = new ethers.Wallet(
        // private key of waller
        process.env.GANACHE_PRIVATE_KEY,
        provider
    );

    const abiDir = "../artifacts/contracts";
    const contractABI = "fundMe.sol/FundMe.json";
    const contractBin = "fundMe.sol/FundMe.dbg.json";

    const abi = fs.readFileSync(
        abiDir + contractABI,
        "utf8"
    );

    const binary = fs.readFileSync(
        abiDir + contractBin,
        "utf-8"
    );

    // const contractFactory = await ethers.getContractFactory(abi, binary, wallet);

    // const Contract = await ethers.getContractFactory("FundMe");

    const currentTimestampInSeconds = Math.round(Date.now() / 1000);
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

    //   const lockedAmount = hre.ethers.utils.parseEther("1");

    console.log(`Deploying`);

    const txRaw = {
        nonce: await wallet.getTransactionCount(),
        gasPrice: 20000000000,
        gasLimit: 100000,
        to: null,
        value: 0,
        data:
            binary
        // "0xBin"
        ,
        chainId: 1337,
    };

    const txSigned = await wallet.signTransaction(tx);

    console.log('\n signed transaction: \n', txSigned);

    const txSent = await wallet.sendTransaction(
        // txSigned
        tx
    )

    console.log(`\n sent transaction: \n`, sentTx);

    console.log(
        `at ${unlockTime} deployed to ${contract.address} by ${owner}`
    );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
