import { Wallet } from '@ethersproject/wallet'

import {
  EIP712VC,
  VerifiableCredential,
  EIP712VerifiableCredential,
  DEFAULT_CONTEXT,
  EIP712_CONTEXT,
  DEFAULT_VC_TYPE
} from '../src/eip712vc'


describe('attest', () => {
  let eip712vc: EIP712VC

  beforeEach(() => {
    eip712vc = new EIP712VC({
      name: 'Krebit',
      version: '0.1',
      chainId: 4,
      verifyingContract: '0xa533e32144b5be3f76446f47696bbe0764d5339b',
    })
  })

  it('should create a proper Solidity EIP712 VerifiableCredential with Krebit Schema', async () => {
    let issuanceDate = Date.now()
    let expirationDate = new Date()
    expirationDate.setFullYear(expirationDate.getFullYear() + 3)

    let issuerType = [
      { name: 'id', type: 'string' },
      { name: 'ethereumAddress', type: 'address' },
    ]

    let credentialSubjectTypes = {
      CredentialSubject: [
        { name: "id", type: "string" },
        { name: "ethereumAddress", type: "address" },
        { name: "_type", type: "string" },
        { name: "value", type: "string" },
        { name: "encrypted", type: "string" },
        { name: "trust", type: "uint8" },
        { name: "stake", type: "uint256" },
        { name: "nbf", type: "uint256" },
        { name: "exp", type: "uint256" },
      ]
    }

    let credential = {
      _context: [DEFAULT_CONTEXT, EIP712_CONTEXT].join(','),
      _type: [DEFAULT_VC_TYPE].join(','),
      id: 'https://example.org/person/1234',
      issuer: {
        id: 'did:issuer',
        ethereumAddress: 'acc1',
      },
      credentialSubject: {
        id: "did:user",
        ethereumAddress: 'acc1',
        _type: "fullName",
        value: "encrypted",
        encrypted:
          "0x0c94bf56745f8d3d9d49b77b345c780a0c11ea997229f925f39a1946d51856fb",
        trust: 50,
        stake: 6,
        nbf: Math.floor(issuanceDate / 1000),
        exp: Math.floor(expirationDate.getTime() / 1000),
      },
      credentialSchema: {
        id: 'https://example.com/schemas/v1',
        _type: 'Eip712SchemaValidator2021',
      },
      issuanceDate: new Date(issuanceDate).toISOString(),
      expirationDate: new Date(expirationDate).toISOString(),
      
    }

    //console.log(credential)

    const credentialTypedData = eip712vc.getEIP712CredentialTypedData(credential, issuerType, credentialSubjectTypes)
    //console.log(credentialTypedData)

    const wallet = Wallet.createRandom()

    const vc: EIP712VerifiableCredential = eip712vc.createEIP712VerifiableCredential(
      wallet._signingKey().privateKey,
      credentialTypedData,
    )

    //console.log(vc)

    expect(
      await eip712vc.verifyEIP712Credential(await wallet.getAddress(), credentialTypedData, vc.proof.proofValue)
    ).toBeTruthy()
  })

  it('should create a proper W3C EIP712 VerifiableCredential with nested credialSubjectSchemas', async () => {
    let issuanceDate = Date.now()
    let expirationDate = new Date()
    expirationDate.setFullYear(expirationDate.getFullYear() + 3)

    let issuerType = [{ name: 'id', type: 'string' }]

    let credentialSubjectTypes = {
      CredentialSubject: [
        { name: 'type', type: 'string' },
        { name: 'id', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'child', type: 'Person' },
      ],
      Person: [
        { name: 'type', type: 'string' },
        { name: 'name', type: 'string' },
      ],
    }

    let credential = {
      '@context': [DEFAULT_CONTEXT, EIP712_CONTEXT],
      type: [DEFAULT_VC_TYPE],
      id: 'https://example.org/person/1234',
      issuer: {
        id: 'did:issuer',
      },
      credentialSubject: {
        type: 'Person',
        id: 'did:example:bbbbaaaa',
        name: 'Vitalik',
        child: {
          type: 'Person',
          name: 'Ethereum',
        },
      },
      credentialSchema: {
        id: 'https://example.com/schemas/v1',
        type: 'Eip712SchemaValidator2021',
      },
      issuanceDate: new Date(issuanceDate).toISOString(),
      expirationDate: new Date(expirationDate).toISOString(),
      proof: {
        verificationMethod: 'did:issuer#key-1',
        ethereumAddress: 'acc1',
        created: new Date(issuanceDate).toISOString(),
        proofPurpose: 'assertionMethod',
        type: 'EthereumEip712Signature2021',
      },
    }

    //console.log(credential)

    const credentialTypedData = eip712vc.getW3CCredentialTypedData(credential, issuerType, credentialSubjectTypes)

    //console.log(credentialTypedData)

    const wallet = Wallet.createRandom()

    const vc: VerifiableCredential = eip712vc.createW3CVerifiableCredential(
      wallet._signingKey().privateKey,
      credentialTypedData
    )

    //console.log(vc)

    expect(
      await eip712vc.verifyW3CCredential(await wallet.getAddress(), credentialTypedData, vc.proof.proofValue)
    ).toBeTruthy()
  })
})
