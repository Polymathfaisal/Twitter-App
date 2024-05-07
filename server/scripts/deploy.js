const { ethers, run, network } = require("hardhat")

const main = async () => {
    const contractFactory = await ethers.getContractFactory("TwitterContract");
    const contract = await contractFactory.deploy();
    await contract.deployed();

    console.log("Contract deployed to: ", contract.address);

    if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for block confirmations...");
        await contract.deployTransaction.wait(9);
        await verify(contract.address, []);
    }
};

//Programmatically verify our code in ether-scan
async function verify(contractAddress, args) {
    console.log("Verifying Contract....");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified");
        } else {
            console.log(e);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    });
