import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TipBBS", function () {
  async function deployFixture() {
    const [owner, account1, account2] = await ethers.getSigners();

    const BBS = await ethers.getContractFactory("TipBBS");
    const bbs = await BBS.deploy();

    return { bbs, owner, account1, account2 };
  }

  describe("post", function () {
    it("投稿することができる", async function () {
      const { bbs, account1 } = await loadFixture(deployFixture);
      const postId = 1;
      const text = "First Post";

      await bbs.connect(account1).post(text);

      const events = await bbs.queryFilter(bbs.filters.Posted(postId));

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
      const postId1 = 2;
      const postId2 = 3;
      const text1 = "Reply Post #1";
      const text2 = "Reply Post #2";

      await bbs.connect(account1).post("First Post");
      await bbs.connect(account2).reply(parentPostId, text1);

      // 親投稿が存在しない場合はエラー
      await expect(bbs.connect(account2).reply(postId1 + 1, text1)).to.be.revertedWith("Parent post does not exist");

      await bbs.connect(account1).reply(parentPostId, text2); // 自身の投稿に返信することが可能

      const events = await bbs.queryFilter(bbs.filters.Replied(undefined, undefined, parentPostId));

      expect(await bbs.latestPostId()).to.equal(postId2);

      expect(events[0].args.postId).to.equal(postId1);
      expect(events[0].args.user).to.equal(account2.address);
      expect(events[0].args.parentPostId).to.equal(parentPostId);
      expect(events[0].args.text).to.equal(text1);

      expect(events[1].args.postId).to.equal(postId2);
      expect(events[1].args.user).to.equal(account1.address);
      expect(events[1].args.parentPostId).to.equal(parentPostId);
      expect(events[1].args.text).to.equal(text2);
    });
  });

  describe("like", function () {
    it("like することができる", async function () {
      const { bbs, account1, account2 } = await loadFixture(deployFixture);
      const postId = 1;

      await bbs.connect(account1).post("First Post");
      await bbs.connect(account2).like(postId);

      // 存在しない投稿の場合はエラー
      await expect(bbs.connect(account2).like(postId + 1)).to.be.revertedWith("Post does not exist");
      // 既に like している場合はエラー
      await expect(bbs.connect(account2).like(postId)).to.be.revertedWith("Like state is already set");
      // 既に like or dislike している場合はエラー
      await expect(bbs.connect(account2).dislike(postId)).to.be.revertedWith("Like state is already set");
      // 自身の投稿に like しようとした場合はエラー
      await expect(bbs.connect(account1).like(postId)).to.be.revertedWith("Only others can perform this action");

      const events = await bbs.queryFilter(bbs.filters.Liked(postId));

      expect(events[0].args.postId).to.equal(postId);
      expect(events[0].args.user).to.equal(account2.address);
    });
  });

  describe("likeWithTip", function () {
    it("like 時に送金ができる", async function () {
      const { bbs, account1, account2 } = await loadFixture(deployFixture);
      const postId = 1;
      const tipAmount = ethers.parseEther("1");
      const tipAmountBigInt = BigInt(tipAmount.toString());

      await bbs.connect(account1).post("First Post");

      const account1PrevBalance = await ethers.provider.getBalance(account1.address);
      const account2PrevBalance = await ethers.provider.getBalance(account2.address);
      const tx = await bbs.connect(account2).likeWithTip(postId, { value: tipAmount });
      const receipt = await tx.wait();
      expect(receipt).to.exist;

      // account1 に送金されていることを確認する
      const account1NewBalance = await ethers.provider.getBalance(account1.address);
      const account1PrevBalanceBigInt = BigInt(account1PrevBalance.toString());
      expect(BigInt(account1NewBalance.toString())).to.equal(account1PrevBalanceBigInt + tipAmountBigInt);

      // account2 が送金していることを確認する
      const gasUsed = BigInt(receipt!.gasUsed.toString());
      const txPrice = BigInt(tx.gasPrice.toString());
      const txCost = gasUsed * txPrice;
      const account2PrevBalanceBigInt = BigInt(account2PrevBalance.toString());
      const account2NewBalance = await ethers.provider.getBalance(account2.address);
      expect(BigInt(account2NewBalance.toString())).to.equal(account2PrevBalanceBigInt - tipAmountBigInt - txCost);

      const tipEvents = await bbs.queryFilter(bbs.filters.Tipped(postId));
      expect(tipEvents[0].args.postId).to.equal(postId);
      expect(tipEvents[0].args.user).to.equal(account2.address);
      expect(tipEvents[0].args.value).to.equal(tipAmount);

      // like の基本機能を確認する
      // 存在しない投稿の場合はエラー
      await expect(bbs.connect(account2).like(postId + 1)).to.be.revertedWith("Post does not exist");
      // 既に like している場合はエラー
      await expect(bbs.connect(account2).like(postId)).to.be.revertedWith("Like state is already set");
      // 既に like or dislike している場合はエラー
      await expect(bbs.connect(account2).dislike(postId)).to.be.revertedWith("Like state is already set");
      // 自身の投稿に like しようとした場合はエラー
      await expect(bbs.connect(account1).like(postId)).to.be.revertedWith("Only others can perform this action");

      const events = await bbs.queryFilter(bbs.filters.Liked(postId));

      expect(events[0].args.postId).to.equal(postId);
      expect(events[0].args.user).to.equal(account2.address);
    });

    it("like 時に金額の指定がない場合はエラーになる", async function () {
      const { bbs, account1, account2 } = await loadFixture(deployFixture);
      const postId = 1;

      await bbs.connect(account1).post("First Post");

      await expect(bbs.connect(account2).likeWithTip(postId)).to.be.revertedWith(
        "Must send Ether to like a post with a tip"
      );
    });
  });

  describe("dislike", function () {
    it("dislike することができる", async function () {
      const { bbs, account1, account2 } = await loadFixture(deployFixture);
      const postId = 1;

      await bbs.connect(account1).post("First Post");
      await bbs.connect(account2).dislike(postId);

      // 存在しない投稿の場合はエラー
      await expect(bbs.connect(account2).dislike(postId + 1)).to.be.revertedWith("Post does not exist");
      // 既に like している場合はエラー
      await expect(bbs.connect(account2).dislike(postId)).to.be.revertedWith("Like state is already set");
      // 既に like or dislike している場合はエラー
      await expect(bbs.connect(account2).like(postId)).to.be.revertedWith("Like state is already set");
      // 自身の投稿に dislike しようとした場合はエラー
      await expect(bbs.connect(account1).dislike(postId)).to.be.revertedWith("Only others can perform this action");

      const events = await bbs.queryFilter(bbs.filters.Disliked(postId));

      expect(events[0].args.postId).to.equal(postId);
      expect(events[0].args.user).to.equal(account2.address);
    });
  });
});
