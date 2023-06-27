import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("HelloWorld", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const helloWorld = await HelloWorld.deploy();

    return { helloWorld, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("正しいオーナーがセットされる", async function () {
      const { helloWorld, owner } = await loadFixture(deployFixture);
      expect(await helloWorld.owner()).to.equal(owner.address);
    });
  });

  describe("hello", function () {
    it("hello world が返却される", async function () {
      const { helloWorld } = await loadFixture(deployFixture);
      expect(await helloWorld.hello()).to.equal("Hello, World!");
    });
  });
});
