// const ethers = require("ethers")
const { ethers } = require("hardhat")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    const wallet = new ethers.Wallet(process.env.GANACHE_PRIVATE_KEY)
    const encryptedJsonKey = await wallet.encrypt(
        process.env.CODEC_PASS,
        process.env.GANACHE_PRIVATE_KEY
    )
    console.log(encryptedJsonKey)
    fs.writeFileSync("$gol/blockchain/.encryptedKey.json", encryptedJsonKey)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })