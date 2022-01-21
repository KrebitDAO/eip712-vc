# eip712-vc

# <img src="krebit-icon.png" alt="Krebit" height="40px" align="left"> Krebit EIP712 Verifiable Credentials SDK

[![Docs](https://img.shields.io/badge/docs-%F0%9F%93%84-blue)](https://docs.krebit.co)

This repository hosts the [Krebit] EIP712-VC tools, based on [W3C Ethereum EIP712 Signature 2021 Draft].

[krebit]: http://krebit.co
[w3c ethereum eip712 signature 2021 draft]: https://w3c-ccg.github.io/ethereum-eip712-signature-2021-spec

It provides functions for creating both W3C compliant Verifiable Credentials, and also a Solidity compatible version that can be used in contracts like [krebit-contracts].

[krebit-contracts]: https://github.com/KrebitDAO/krb-contracts

## Overview

### Installation

```console
$ npm install -s @krebitdao/eip721-vc
```

### Configuring the EIP712 Domain

```javascript
import {
  EIP712VC,
  VerifiableCredential,
  EIP712VerifiableCredential,
  DEFAULT_CONTEXT,
  EIP712_CONTEXT,
  DEFAULT_VC_TYPE,
} from '@krebitdao/eip721-vc'

let eip712vc = new EIP712VC({
  name: 'Krebit',
  version: '0.1',
  chainId: 4,
  verifyingContract: '0xa533e32144b5be3f76446f47696bbe0764d5339b',
})
```

### W3C EIP712 Verifiable Credentials

#### Creating

```javascript
import { Wallet } from '@ethersproject/wallet'

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

const credentialTypedData = eip712vc.getW3CCredentialTypedData(credential, issuerType, credentialSubjectTypes)

const wallet = Wallet.createRandom()

const vc: VerifiableCredential = eip712vc.createW3CVerifiableCredential(
  wallet._signingKey().privateKey,
  credentialTypedData
)
```

#### Verifying

```javascript
await eip712vc.verifyW3CCredential(await wallet.getAddress(), credentialTypedData, vc.proof.proofValue)
```

### Creating Solidity Compatible EIP712 Verifiable Credentials

#### Creating

```javascript
import { Wallet } from '@ethersproject/wallet'

let issuanceDate = Date.now()
let expirationDate = new Date()
expirationDate.setFullYear(expirationDate.getFullYear() + 3)

let issuerType = [
  { name: 'id', type: 'string' },
  { name: 'ethereumAddress', type: 'address' },
]

let credentialSubjectTypes = {
  CredentialSubject: [
    { name: 'id', type: 'string' },
    { name: 'ethereumAddress', type: 'address' },
    { name: '_type', type: 'string' },
    { name: 'value', type: 'string' },
    { name: 'encrypted', type: 'string' },
    { name: 'trust', type: 'uint8' },
    { name: 'stake', type: 'uint256' },
    { name: 'nbf', type: 'uint256' },
    { name: 'exp', type: 'uint256' },
  ],
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
    id: 'did:user',
    ethereumAddress: 'acc1',
    _type: 'fullName',
    value: 'encrypted',
    encrypted: '0x0c94bf56745f8d3d9d49b77b345c780a0c11ea997229f925f39a1946d51856fb',
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

const credentialTypedData = eip712vc.getEIP712CredentialTypedData(credential, issuerType, credentialSubjectTypes)

const wallet = Wallet.createRandom()

const vc: EIP712VerifiableCredential = eip712vc.createEIP712VerifiableCredential(
  wallet._signingKey().privateKey,
  credentialTypedData
)
```

#### Verifying

```javascript
await eip712vc.verifyEIP712Credential(await wallet.getAddress(), credentialTypedData, vc.proof.proofValue)
```

## Learn More

The guides in the [docs site](http://docs.krebit.co) will teach about different concepts of the Krebit Protocol.

## Contribute

Krebit Protocol exists thanks to its contributors. There are many ways you can participate and help build public goods. Check out the [Krebit Gitcoin Grants](https://gitcoin.co/grants/3522/krebit)!

## License

Krebit EIP712-VC is released under the [MIT License](LICENSE).
