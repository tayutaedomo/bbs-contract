/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomicfoundation/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "BBS",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BBS__factory>;
    getContractFactory(
      name: "TipBBS",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TipBBS__factory>;

    getContractAt(
      name: "BBS",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.BBS>;
    getContractAt(
      name: "TipBBS",
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<Contracts.TipBBS>;

    deployContract(
      name: "BBS",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BBS>;
    deployContract(
      name: "TipBBS",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TipBBS>;

    deployContract(
      name: "BBS",
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.BBS>;
    deployContract(
      name: "TipBBS",
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.TipBBS>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string | ethers.Addressable,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.Contract>;
    deployContract(
      name: string,
      args: any[],
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.Contract>;
  }
}
