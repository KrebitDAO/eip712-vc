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
  verifyingContract: '0x00000000000000000000000000000000000000000000',
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

const wallet = Wallet.createRandom()

const vc: VerifiableCredential = await eip712vc.createW3CVerifiableCredential(
  credential,
  credentialSubjectTypes,
  async (data: TypedMessage<EIP712MessageTypes>) => {
    // Replace this fuction with your own signing code
    return signTypedData_v4(Buffer.from(wallet._signingKey().privateKey.slice(2), 'hex'), { data })
  }
)
```

#### Verifying

```javascript
eip712vc.verifyW3CCredential(await wallet.getAddress(), credential, credentialSubjectTypes, vc.proof.proofValue)
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

const vc: EIP712VerifiableCredential = await eip712vc.createEIP712VerifiableCredential(
  credential,
  credentialSubjectTypes,
  async (data: TypedMessage<EIP712MessageTypes>) => {
    // Replace this fuction with your own signing code
    return signTypedData_v4(Buffer.from(wallet._signingKey().privateKey.slice(2), 'hex'), { data })
  }
)
```

#### Verifying

```javascript
eip712vc.verifyEIP712Credential(await wallet.getAddress(), credential, credentialSubjectTypes, vc.proof.proofValue)
```

### Creating Krebit Compatible EIP712 Verifiable Credentials

#### Creating

```javascript
import { getKrebitCredentialTypes } from '@krebitdao/eip721-vc'

let issuanceDate = Date.now()
let expirationDate = new Date()
expirationDate.setFullYear(expirationDate.getFullYear() + 3)

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

let krebitTypes = getKrebitCredentialTypes()

const vc = await eip712vc.createEIP712VerifiableCredential(credential, krebitTypes, async (data) => {
  // Replace this fuction with your own signing code
  return await issuerSigner._signTypedData(
    {
      name: 'Krebit',
      version: '0.1',
      chainId: 4,
      verifyingContract: '0x00000000000000000000000000000000000000000000',
    },
    krebitTypes,
    credential
  )
})
```

#### Verifying

```javascript
eip712vc.verifyEIP712Credential(issuerAddress, credential, krebitTypes, vc.proof.proofValue)
```

## Learn More

The guides in the [docs site](http://docs.krebit.co) will teach about different concepts of the Krebit Protocol.

## Contribute

Krebit Protocol exists thanks to its contributors. There are many ways you can participate and help build public goods. Check out the [Krebit Gitcoin Grants](https://gitcoin.co/grants/3522/krebit)!

## License

Krebit EIP712-VC is released under the [MIT License](LICENSE).
