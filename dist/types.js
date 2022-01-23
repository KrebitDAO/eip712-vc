"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROOF_W3C_TYPE = exports.VERIFIABLE_CREDENTIAL_W3C_TYPE = exports.CREDENTIAL_SCHEMA_W3C_TYPE = exports.PROOF_EIP712_TYPE = exports.VERIFIABLE_CREDENTIAL_EIP712_TYPE = exports.CREDENTIAL_SCHEMA_EIP712_TYPE = exports.VERIFIABLE_CREDENTIAL_PRIMARY_TYPE = exports.DOMAIN_TYPE = exports.DOMAIN_ENCODING = void 0;
exports.DOMAIN_ENCODING = 'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)';
exports.DOMAIN_TYPE = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' },
];
exports.VERIFIABLE_CREDENTIAL_PRIMARY_TYPE = 'VerifiableCredential';
exports.CREDENTIAL_SCHEMA_EIP712_TYPE = [
    { name: 'id', type: 'string' },
    { name: '_type', type: 'string' },
];
exports.VERIFIABLE_CREDENTIAL_EIP712_TYPE = [
    { name: '_context', type: 'string' },
    { name: '_type', type: 'string' },
    { name: 'id', type: 'string' },
    { name: 'issuer', type: 'Issuer' },
    { name: 'credentialSubject', type: 'CredentialSubject' },
    { name: 'credentialSchema', type: 'CredentialSchema' },
    { name: 'issuanceDate', type: 'string' },
    { name: 'expirationDate', type: 'string' },
];
exports.PROOF_EIP712_TYPE = [
    { name: 'verificationMethod', type: 'string' },
    { name: 'ethereumAddress', type: 'address' },
    { name: 'created', type: 'string' },
    { name: 'proofPurpose', type: 'string' },
    { name: '_type', type: 'string' },
];
exports.CREDENTIAL_SCHEMA_W3C_TYPE = [
    { name: 'id', type: 'string' },
    { name: 'type', type: 'string' },
];
exports.VERIFIABLE_CREDENTIAL_W3C_TYPE = [
    { name: '@context', type: 'string[]' },
    { name: 'type', type: 'string[]' },
    { name: 'id', type: 'string' },
    { name: 'issuer', type: 'Issuer' },
    { name: 'credentialSubject', type: 'CredentialSubject' },
    { name: 'credentialSchema', type: 'CredentialSchema' },
    { name: 'issuanceDate', type: 'string' },
    { name: 'expirationDate', type: 'string' },
    //{ name: 'proof', type: 'Proof' },
];
exports.PROOF_W3C_TYPE = [
    { name: 'verificationMethod', type: 'string' },
    { name: 'ethereumAddress', type: 'address' },
    { name: 'created', type: 'string' },
    { name: 'proofPurpose', type: 'string' },
    { name: 'type', type: 'string' },
];
//# sourceMappingURL=types.js.map