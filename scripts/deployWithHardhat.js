// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");
const { ethers } = require("hardhat");
const fs = require("fs-extra");
require("dotenv").config();
// const ethers = require("ethers");

async function main() {

    const provider = new ethers.providers.JsonRpcProvider(
        // blockchain node: hardhat /ganache
        process.env.LOCAL_TESTNET_RPC
    );


    // wallet from encrypted key

    const encryptedJson = fs.readFileSync(
        "/home/gnostic/Golem/blockchain/.encryptedKey.json", "utf-8"
    );

    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        process.env.CODEC_PASS
    )

    wallet = await wallet.connect(provider);

    // const wallet =
    //     new ethers.Wallet(
    //         // private key of waller
    //         process.env.GANACHE_PRIVATE_KEY,
    //         provider
    //     );


    const abiDir = "/home/gnostic/Golem/blockchain/artifacts/contracts/";
    const contractABI =
        // "store.sol/Stored.json";
        "contracts_store_sol_Stored.abi";
    const contractBin =
        // "store.sol/Stored.dbg.json";
        "contracts_store_sol_Stored.bin";

    const abi = fs.readFileSync(
        abiDir + contractABI,
        "utf8"
    );

    const binary = fs.readFileSync(
        abiDir + contractBin,
        "utf-8"
    );

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);

    console.log(`Deploying`);
    const contract = await contractFactory.deploy(
        // unlockTime, { value: lockedAmount }
    );

    const deployResponse = contract.deployTransaction
    console.log(`\n deployment (transaction response): \n`);
    console.log(deployResponse);

    // waits for 1 block confirmation
    const transactionReceipt = await deployResponse.wait(1);
    console.log('\n transaction receipt: \n');
    console.log(transactionReceipt);

    const Num = await contract.Num();

    console.log(`stored Number is:`, Num.toString());

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
