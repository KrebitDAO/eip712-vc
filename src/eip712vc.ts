import { utils } from 'ethers'

const { keccak256, getAddress, toUtf8Bytes, defaultAbiCoder } = utils

import { TypedMessage, recoverTypedSignature_v4, signTypedData_v4 } from 'eth-sig-util'

import {
  DOMAIN_ENCODING,
  EIP712Config,
  EIP712DomainTypedData,
  DOMAIN_TYPE,
  VERIFIABLE_CREDENTIAL_PRIMARY_TYPE,
  VERIFIABLE_CREDENTIAL_EIP712_TYPE,
  CREDENTIAL_SCHEMA_EIP712_TYPE,
  VERIFIABLE_CREDENTIAL_W3C_TYPE,
  CREDENTIAL_SCHEMA_W3C_TYPE,
  //PROOF_EIP712_TYPE,
  EIP712CredentialTypedData,
  EIP712MessageTypes,
  EIP712Credential,
  EIP712VerifiableCredential,
  W3CCredentialTypedData,
} from './types'

import {
  CredentialPayload,
  PresentationPayload,
  VerifiableCredential,
  W3CCredential,
  W3CPresentation,
  Verifiable,
} from 'did-jwt-vc'
import { Proof } from 'did-jwt-vc/lib/types'

export {
  EIP712Config,
  CredentialPayload,
  PresentationPayload,
  VerifiableCredential,
  EIP712VerifiableCredential,
  Verifiable,
  W3CCredential,
  W3CPresentation,
}

export const DEFAULT_CONTEXT = 'https://www.w3.org/2018/credentials/v1'
export const EIP712_CONTEXT =
  'https://raw.githubusercontent.com/w3c-ccg/ethereum-eip712-signature-2021-spec/main/contexts/v1/index.json'
export const DEFAULT_VC_TYPE = 'VerifiableCredential'


export class EIP712VC {
  private eip712Config: EIP712Config

  public constructor(eip712Config: EIP712Config) {
    this.eip712Config = eip712Config
  }

  public getDomainSeparator() {
    return keccak256(
      defaultAbiCoder.encode(
        ['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'],
        [
          keccak256(toUtf8Bytes(DOMAIN_ENCODING)),
          keccak256(toUtf8Bytes(this.eip712Config.name)),
          keccak256(toUtf8Bytes(this.eip712Config.version)),
          this.eip712Config.chainId,
          this.eip712Config.verifyingContract,
        ]
      )
    )
  }

  public getDomainTypedData(): EIP712DomainTypedData {
    return {
      name: this.eip712Config.name,
      version: this.eip712Config.version,
      chainId: this.eip712Config.chainId,
      verifyingContract: this.eip712Config.verifyingContract,
    }
  }

  /**
   * Creates a VerifiableCredential given a `EIP712CredentialTypedData`
   *
   * This method transforms the payload into the [EIP712 Typed Data](https://eips.ethereum.org/EIPS/eip-712)
   * described in the [W3C EIP712 VC spec](https://w3c-ccg.github.io/ethereum-eip712-signature-2021-spec) and then validated to conform to the minimum spec
   * required W3C spec.
   *
   * @param privateKey `Issuer` the DID, signer and algorithm that will sign the token
   * @param credentialTypedData `EIP712CredentialTypedData`
   * @return a `Promise` that resolves to the verifiable credential or rejects with `TypeError` if the
   * `payload` is not W3C compliant
   */
  public createW3CVerifiableCredential(
    privateKey: string,
    credentialTypedData: W3CCredentialTypedData,
  ): VerifiableCredential {
    let data: TypedMessage<EIP712MessageTypes> = credentialTypedData

    let signature = signTypedData_v4(Buffer.from(privateKey.slice(2), 'hex'), { data })

    let credential : W3CCredential = {...credentialTypedData.message};

    let proof: Proof = {
      verificationMethod: credentialTypedData.message.issuer.id+"#ethereumAddress",
      ethereumAddress: credentialTypedData.message.issuer.ethereumAddress,
      created: new Date(Date.now()).toISOString(),
      proofPurpose: 'assertionMethod',
      type: 'EthereumEip712Signature2021',
      ...credentialTypedData.message.proof,
      proofValue: signature,
      eip712: {
        domain: { ...data.domain },
        types: { ...data.types },
        primaryType: data.primaryType,
      },
    }

    let verifiableCredential = {
      ...credential,
      proof,
    }

    return verifiableCredential
  }

  public getW3CCredentialTypedData(
    credential: W3CCredential,
    issuerType: any,
    credentialSubjectTypes: any
  ): W3CCredentialTypedData {
    return {
      domain: this.getDomainTypedData(),
      primaryType: VERIFIABLE_CREDENTIAL_PRIMARY_TYPE,
      message: credential,
      types: {
        EIP712Domain: DOMAIN_TYPE,
        VerifiableCredential: VERIFIABLE_CREDENTIAL_W3C_TYPE,
        CredentialSchema: CREDENTIAL_SCHEMA_W3C_TYPE,
        ...credentialSubjectTypes,
        Issuer: issuerType,
        //Proof: PROOF_EIP712_TYPE,
      },
    }
  }

  public verifyW3CCredential(issuer: string, credentialTypedData: W3CCredentialTypedData, proofValue: string): boolean {
    let data: TypedMessage<EIP712MessageTypes> = credentialTypedData
    const recoveredAddress = recoverTypedSignature_v4({
      data,
      sig: proofValue,
    })

    return getAddress(issuer) === getAddress(recoveredAddress)
  }



  /**
   * Creates a VerifiableCredential given a `EIP712CredentialTypedData`
   *
   * This method transforms the payload into the [EIP712 Typed Data](https://eips.ethereum.org/EIPS/eip-712)
   * described in the [W3C EIP712 VC spec](https://w3c-ccg.github.io/ethereum-eip712-signature-2021-spec) and then validated to conform to the minimum spec
   * required W3C spec.
   *
   * @param privateKey `Issuer` the DID, signer and algorithm that will sign the token
   * @param credentialTypedData `EIP712CredentialTypedData`
   * @return a `Promise` that resolves to the verifiable credential or rejects with `TypeError` if the
   * `payload` is not W3C compliant
   */
   public createEIP712VerifiableCredential(
    privateKey: string,
    credentialTypedData: EIP712CredentialTypedData,
  ): EIP712VerifiableCredential {
    let data: TypedMessage<EIP712MessageTypes> = credentialTypedData

    let signature = signTypedData_v4(Buffer.from(privateKey.slice(2), 'hex'), { data })

    let credential : EIP712Credential = {...credentialTypedData.message};

    let proof: Proof = {
      verificationMethod: credentialTypedData.message.issuer.id+"#ethereumAddress",
      ethereumAddress: credentialTypedData.message.issuer.ethereumAddress,
      created: new Date(Date.now()).toISOString(),
      proofPurpose: 'assertionMethod',
      type: 'EthereumEip712Signature2021',
      ...credentialTypedData.message.proof,
      proofValue: signature,
      eip712: {
        domain: { ...data.domain },
        types: { ...data.types },
        primaryType: data.primaryType,
      },
    }

    let verifiableCredential = {
      ...credential,
      proof,
    }

    return verifiableCredential
  }

  public getEIP712CredentialTypedData(
    credential: EIP712Credential,
    issuerType: any,
    credentialSubjectTypes: any
  ): EIP712CredentialTypedData {
    return {
      domain: this.getDomainTypedData(),
      primaryType: VERIFIABLE_CREDENTIAL_PRIMARY_TYPE,
      message: credential,
      types: {
        EIP712Domain: DOMAIN_TYPE,
        VerifiableCredential: VERIFIABLE_CREDENTIAL_EIP712_TYPE,
        CredentialSchema: CREDENTIAL_SCHEMA_EIP712_TYPE,
        ...credentialSubjectTypes,
        Issuer: issuerType,
        //Proof: PROOF_EIP712_TYPE,
      },
    }
  }

  public verifyEIP712Credential(issuer: string, credentialTypedData: EIP712CredentialTypedData, proofValue: string): boolean {
    let data: TypedMessage<EIP712MessageTypes> = credentialTypedData
    const recoveredAddress = recoverTypedSignature_v4({
      data,
      sig: proofValue,
    })

    return getAddress(issuer) === getAddress(recoveredAddress)
  }

}
