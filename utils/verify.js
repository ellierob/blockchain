const { run } = require("hardhat");

module.exports = async (_contractAdr, args) => {

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