// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");
const { ethers, run, network } = require("hardhat");
const fs = require("fs-extra");
require("dotenv").config();
// const ethers = require("ethers");

async function main() {

    const provider = new ethers.providers.JsonRpcProvider(
        // blockchain node: hardhat /ganache
        // process.env.LOCAL_TESTNET_RPC
        process.env.ALCHEMY_GOERLI_TESTNET_RPC_URL
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
    //         // process.env.GANACHE_PRIVATE_KEY,
    //         process.env.TEST_PRIVATE_KEY,
    //         provider
    //     );

    const contractFactory = await ethers.getContractFactory("Stored");

    console.log(`Deploying`);
    const contract = await contractFactory.deploy(
        // unlockTime, { value: lockedAmount }
    );

    const contactAddr = await contract.address;

    const deployer = await contract.signer.getAddress();

    console.log(`contract deployed at ${contactAddr} by ${deployer}`);

    // fs.writeFileSync()

    if (network.chainId == 5 && process.env.ETHERSCAN_API_KEY) {
        await contract.deployTransaction.wait(6);
        verify(contactAddr, []);
    }

    const Num = await contract.Num();

    console.log(`stored Number is:`, Num.toString());

    const txResp = await contract.store(4);

    await txResp.wait(1);

    const updatedNum = await contract.Num();

    console.log(`updated Number is:`, updatedNum.toString());

}

async function verify(_contractAdr, args) {

    console.log(`Verifying contract`);

    try {
        await run(
            "verify:verify",
            {
                address: _contractAdr,
                constructorArguments: args
            }
        );
    } catch (er) {
        if (er.message.toLowerCase().includes("already verified")) {
            console.log(`Already verified`);
        } else {
            // throw Error(er.message);
            console.log(er.message);
        }
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
