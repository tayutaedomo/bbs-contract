import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.deployContract("HelloWorld");
  await contract.waitForDeployment();

  console.log(`Contract deployed to ${contract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
