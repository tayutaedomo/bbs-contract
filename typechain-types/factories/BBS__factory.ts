/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type { BBS, BBSInterface } from "../BBS";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060f78061005f6000396000f3fe6080604052348015600f57600080fd5b506004361060285760003560e01c80638da5cb5b14602d575b600080fd5b60336047565b604051603e919060a8565b60405180910390f35b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000609482606b565b9050919050565b60a281608b565b82525050565b600060208201905060bb6000830184609b565b9291505056fea2646970667358221220ef352a6d879e282b8178514a0a1b355a0ad59a57bffd8d91f77a99cef1209ecb64736f6c63430008120033";

type BBSConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: BBSConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class BBS__factory extends ContractFactory {
  constructor(...args: BBSConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      BBS & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): BBS__factory {
    return super.connect(runner) as BBS__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BBSInterface {
    return new Interface(_abi) as BBSInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): BBS {
    return new Contract(address, _abi, runner) as unknown as BBS;
  }
}