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

    const ethChainID = 1337;

    const encryptedJson = fs.readFileSync(
        "/home/gnostic/Golem/blockchain/.encryptedKey.json", "utf-8"
    );

    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        process.env.CODEC_PASS
    );

    wallet = await wallet.connect(provider);

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
        chainId: ethChainID,
    };

    const txSigned = await wallet.signTransaction(txRaw);

    console.log('\n signed transaction: \n', txSigned);

    const txSent = await wallet.sendTransaction(
        // txSigned
        txRaw
    )

    console.log(`\n sent transaction: \n`, sentTx);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
