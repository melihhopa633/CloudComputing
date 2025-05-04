require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');
const solc = require('solc');

async function main() {
  try {
    console.log('Connecting to network...');
    const provider = new ethers.JsonRpcProvider('http://localhost:8545');
    const wallet = ethers.Wallet.fromPhrase(process.env.MNEMONIC).connect(provider);
    console.log('Connected to network, wallet address:', await wallet.getAddress());

    console.log('Compiling contract...');
    const source = fs.readFileSync('./MetricContract.sol', 'utf8');
    const input = {
      language: 'Solidity',
      sources: { 'MetricContract.sol': { content: source } },
      settings: { outputSelection: { '*': { '*': ['*'] } } }
    };

    const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
    if (compiled.errors) {
      console.error('Compilation errors:', compiled.errors);
      return;
    }

    const contract = compiled.contracts['MetricContract.sol']['MetricContract'];
    console.log('Contract compiled successfully');

    console.log('Deploying contract...');
    const abi = contract.abi;
    const bytecode = '0x' + contract.evm.bytecode.object;
    
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const deployedContract = await factory.deploy({
      gasLimit: 2000000
    });
    
    console.log('Transaction sent:', deployedContract.deploymentTransaction().hash);
    await deployedContract.waitForDeployment();
    
    const address = await deployedContract.getAddress();
    console.log('Contract deployed at:', address);

    // Update .env file
    const envContent = fs.readFileSync('.env', 'utf8');
    const updatedEnv = envContent.replace(
      /CONTRACT_ADDRESS=.*/,
      `CONTRACT_ADDRESS=${address}`
    );
    fs.writeFileSync('.env', updatedEnv);
    console.log('Updated CONTRACT_ADDRESS in .env file');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 