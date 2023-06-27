import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BBS", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const BBS = await ethers.getContractFactory("BBS");
    const bbs = await BBS.deploy();

    return { bbs, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("正しいオーナーがセットされる", async function () {
      const { bbs, owner } = await loadFixture(deployFixture);
      expect(await bbs.owner()).to.equal(owner.address);
    });
  });
});
