import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("BBS", function () {
  async function deployFixture() {
    const [owner, account1, account2] = await ethers.getSigners();

    const BBS = await ethers.getContractFactory("BBS");
    const bbs = await BBS.deploy();

    return { bbs, owner, account1, account2 };
  }

  describe("デプロイ", function () {
    it("正しいオーナーがセットされる", async function () {
      const { bbs, owner } = await loadFixture(deployFixture);
      expect(await bbs.owner()).to.equal(owner.address);
    });
  });

  describe("post", function () {
    it("投稿することができる", async function () {
      const { bbs, account1 } = await loadFixture(deployFixture);
      const postId = 1;
      const text = "First Post";

      await bbs.connect(account1).post(text);

      const events = await bbs.queryFilter(bbs.filters.Post(postId));

      expect(await bbs.latestPostId()).to.equal(postId);
      expect(events[0].args.postId).to.equal(postId);
      expect(events[0].args.user).to.equal(account1.address);
      expect(events[0].args.text).to.equal(text);
    });
  });

  describe("reply", function () {
    it("返信することができる", async function () {
      const { bbs, account1, account2 } = await loadFixture(deployFixture);
      const parentPostId = 1;
      const postId = 2;
      const text = "Reply Post";

      await bbs.connect(account1).post("First Post");
      await bbs.connect(account2).reply(parentPostId, text);

      const events = await bbs.queryFilter(bbs.filters.Reply(postId));

      expect(await bbs.latestPostId()).to.equal(postId);
      expect(events[0].args.postId).to.equal(postId);
      expect(events[0].args.user).to.equal(account2.address);
      expect(events[0].args.parentPostId).to.equal(parentPostId);
      expect(events[0].args.text).to.equal(text);
    });
  });

  describe("like", function () {
    it("like することができる", async function () {
      const { bbs, account1, account2 } = await loadFixture(deployFixture);
      const postId = 1;

      await bbs.connect(account1).post("First Post");
      await bbs.connect(account2).like(postId);

      const events = await bbs.queryFilter(bbs.filters.Like(postId));

      expect(events[0].args.postId).to.equal(postId);
      expect(events[0].args.user).to.equal(account2.address);
    });
  });

  describe("dislike", function () {
    it("dislike することができる", async function () {
      const { bbs, account1, account2 } = await loadFixture(deployFixture);
      const postId = 1;

      await bbs.connect(account1).post("First Post");
      await bbs.connect(account2).dislike(postId);

      const events = await bbs.queryFilter(bbs.filters.Dislike(postId));

      expect(events[0].args.postId).to.equal(postId);
      expect(events[0].args.user).to.equal(account2.address);
    });
  });
});
