const ethers = require("ethers")
const fs = require("fs-extra")
require("dotenv").config()

async function main() {
    const encryptedJson = fs.readFileSync(
        "./.encryptedKey.json", "utf-8"
    );


    let wallet = new ethers.Wallet.fromEncryptedJsonSync(
        encryptedJson,
        proces.env.CODEC_PASS
    )

    wallet = await wallet.connect(provider);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })