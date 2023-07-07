import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const oneEtherInWei = BigInt(1e18); // 1 Ether in Wei
const fiveEtherInWei = BigInt(5e18); // 5 Ether in Wei

describe("TipBBS", function () {
  async function deployFixture() {
    const [owner, account1, account2] = await ethers.getSigners();

    await account1.sendTransaction({
      to: account1.address,
      //value: ethers.utils.parseEther("5.0"),
      value: fiveEtherInWei.toString(),
    });

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

      await expect(bbs.connect(account2).like(postId + 1)).to.be.revertedWith("Post does not exist");
      await expect(bbs.connect(account2).like(postId)).to.be.revertedWith("Like state is already set");
      await expect(bbs.connect(account2).dislike(postId)).to.be.revertedWith("Like state is already set");
      await expect(bbs.connect(account1).like(postId)).to.be.revertedWith("Only others can perform this action");

      const events = await bbs.queryFilter(bbs.filters.Liked(postId));

      expect(events[0].args.postId).to.equal(postId);
      expect(events[0].args.user).to.equal(account2.address);
    });
  });

  describe("likeWithTip", function () {
    xit("like 時に送金ができる", async function () {
      const { bbs, account1, account2 } = await loadFixture(deployFixture);
      const postId = 1;
      // const tipAmount = ethers.utils.parseEther("1");
      const tipAmount = oneEtherInWei.toString();

      await bbs.connect(account1).post("First Post");

      const prevBalance = await ethers.provider.getBalance(account1.address);
      const tx = await bbs.connect(account2).likeWithTip(postId, { value: tipAmount });

      // 残高を確認するためにガス代を取得しておく
      const receipt = await tx.wait();
      // const gasUsed = receipt.gasUsed;
      const gasUsed = ethers.BigNumber.from(receipt.gasUsed.toString());
      const txCost = gasUsed.mul(tx.gasPrice);

      // Check if the new balance of post owner is increased by 1 Ether
      const newBalance = await ethers.provider.getBalance(account1.address);
      expect(newBalance).to.equal(prevBalance.add(tipAmount).sub(txCost));

      // Check if the appropriate events have been emitted
      const tipEvents = await bbs.queryFilter(bbs.filters.Tipped(postId));
      expect(tipEvents[0].args.postId).to.equal(postId);
      expect(tipEvents[0].args.user).to.equal(account2.address);
      expect(tipEvents[0].args.value).to.equal(tipAmount);
    });

    it("like 時に金額の指定がない場合はエラー", async function () {
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

      await expect(bbs.connect(account2).dislike(postId + 1)).to.be.revertedWith("Post does not exist");
      await expect(bbs.connect(account2).dislike(postId)).to.be.revertedWith("Like state is already set");
      await expect(bbs.connect(account2).like(postId)).to.be.revertedWith("Like state is already set");
      await expect(bbs.connect(account1).dislike(postId)).to.be.revertedWith("Only others can perform this action");

      const events = await bbs.queryFilter(bbs.filters.Disliked(postId));

      expect(events[0].args.postId).to.equal(postId);
      expect(events[0].args.user).to.equal(account2.address);
    });
  });
});
