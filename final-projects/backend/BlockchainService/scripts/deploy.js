require("dotenv").config({ path: "../../.env" });
const { ethers } = require("ethers");
const fs = require("fs");
const solc = require("solc");

// Bu dosya blockchain kontrat deploy işlemleri içindir, veritabanı ile ilgisi yoktur.

async function main() {
  try {
    console.log("Connecting to network...");
    const provider = new ethers.JsonRpcProvider(
      process.env.RPC_URL || "http://localhost:8545"
    );
    const signer = await provider.getSigner();
    console.log("Connected to network");

    console.log("Compiling contract...");
    const source = fs.readFileSync("./MetricContract.sol", "utf8");
    const input = {
      language: "Solidity",
      sources: { "MetricContract.sol": { content: source } },
      settings: { outputSelection: { "*": { "*": ["*"] } } },
    };

    const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
    if (compiled.errors) {
      console.error("Compilation errors:", compiled.errors);
      return;
    }

    const contract = compiled.contracts["MetricContract.sol"]["MetricContract"];
    console.log("Contract compiled successfully");

    console.log("Deploying contract...");
    const abi = contract.abi;
    const bytecode = "0x" + contract.evm.bytecode.object;

    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const deployedContract = await factory.deploy();

    console.log(
      "Transaction sent:",
      deployedContract.deploymentTransaction().hash
    );
    await deployedContract.waitForDeployment();

    const address = await deployedContract.getAddress();
    console.log("Contract deployed at:", address);
    // Contract adresini bir dosyaya da yaz
    fs.writeFileSync("contract-address.txt", address);
  } catch (error) {
    console.error("Error:", error);
    console.error("Error details:", error.message);
    process.exit(1);
  }
}

main();
