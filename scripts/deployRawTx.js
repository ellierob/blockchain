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
        process.env.LOCAL_TESTNET_RPC
    );

    // const encryptedJson = fs.readFileSync(
    //     "/home/gnostic/Golem/blockchain/.encryptedKey.json", "utf-8"
    // );

    // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    //     encryptedJson,
    //     process.env.CODEC_PASS
    // );

    // wallet = await wallet.connect(provider);

    const wallet =
        new ethers.Wallet(
            // private key of waller
            // process.env.GANACHE_PRIVATE_KEY,
            process.env.HARDHAT_PRIVATE_KEY,
            // process.env.TEST_PRIVATE_KEY,
            provider
        );

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

    // const contractFactory = await ethers.getContractFactory(abi, binary, wallet);

    // const Contract = await ethers.getContractFactory("FundMe");

    console.log(`Deploying`);

    // const ganacheGasPrice = 20000000000;
    const hardhatGasPrice = 22838160372;
    // const goerliGasPrice = 22838160372;


    // const ganacheGasLimit = 100000;
    const hardhatGasLimit = 1000000;

    // const ganacheEthChainID = 1337;
    const hardhatEthChainID = 31337;

    const payee =
        new ethers.Wallet(
            // private key of waller
            // process.env.GANACHE_PRIVATE_KEY,
            process.env.HARDHAT_PRIVATE_KEY2,
            // process.env.TEST_PRIVATE_KEY3,
            provider
        );


    const txRaw = {
        nonce: await wallet.getTransactionCount(),
        gasPrice: await provider.getGasPrice(),
        gasLimit: hardhatGasLimit,
        to: null,
        // to: payee,
        // to: process.env.HARDHAT_PRIVATE_KEY2,
        // value: 10000,
        value: 0,
        data:
            "0x" +
            binary
        // "0xBin"
        ,
        chainId: hardhatEthChainID,
    };

    const txSigned = await wallet.signTransaction(txRaw);

    console.log('\n signed transaction: \n', txSigned);

    const txSent = await wallet.sendTransaction(
        // txSigned
        txRaw
    )

    console.log(`\n sent transaction: \n`, txSent);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
