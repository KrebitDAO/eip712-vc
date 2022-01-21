"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EIP712VC = exports.DEFAULT_VC_TYPE = exports.EIP712_CONTEXT = exports.DEFAULT_CONTEXT = void 0;
var tslib_1 = require("tslib");
var ethers_1 = require("ethers");
var keccak256 = ethers_1.utils.keccak256, getAddress = ethers_1.utils.getAddress, toUtf8Bytes = ethers_1.utils.toUtf8Bytes, defaultAbiCoder = ethers_1.utils.defaultAbiCoder;
var eth_sig_util_1 = require("eth-sig-util");
var types_1 = require("./types");
exports.DEFAULT_CONTEXT = 'https://www.w3.org/2018/credentials/v1';
exports.EIP712_CONTEXT = 'https://raw.githubusercontent.com/w3c-ccg/ethereum-eip712-signature-2021-spec/main/contexts/v1/index.json';
exports.DEFAULT_VC_TYPE = 'VerifiableCredential';
var EIP712VC = /** @class */ (function () {
    function EIP712VC(eip712Config) {
        this.eip712Config = eip712Config;
    }
    EIP712VC.prototype.getDomainSeparator = function () {
        return keccak256(defaultAbiCoder.encode(['bytes32', 'bytes32', 'bytes32', 'uint256', 'address'], [
            keccak256(toUtf8Bytes(types_1.DOMAIN_ENCODING)),
            keccak256(toUtf8Bytes(this.eip712Config.name)),
            keccak256(toUtf8Bytes(this.eip712Config.version)),
            this.eip712Config.chainId,
            this.eip712Config.verifyingContract,
        ]));
    };
    EIP712VC.prototype.getDomainTypedData = function () {
        return {
            name: this.eip712Config.name,
            version: this.eip712Config.version,
            chainId: this.eip712Config.chainId,
            verifyingContract: this.eip712Config.verifyingContract,
        };
    };
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
    EIP712VC.prototype.createW3CVerifiableCredential = function (privateKey, credentialTypedData) {
        var data = credentialTypedData;
        var signature = (0, eth_sig_util_1.signTypedData_v4)(Buffer.from(privateKey.slice(2), 'hex'), { data: data });
        var credential = (0, tslib_1.__assign)({}, credentialTypedData.message);
        var proof = (0, tslib_1.__assign)((0, tslib_1.__assign)({ verificationMethod: credentialTypedData.message.issuer.id + "#ethereumAddress", ethereumAddress: credentialTypedData.message.issuer.ethereumAddress, created: new Date(Date.now()).toISOString(), proofPurpose: 'assertionMethod', type: 'EthereumEip712Signature2021' }, credentialTypedData.message.proof), { proofValue: signature, eip712: {
                domain: (0, tslib_1.__assign)({}, data.domain),
                types: (0, tslib_1.__assign)({}, data.types),
                primaryType: data.primaryType,
            } });
        var verifiableCredential = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, credential), { proof: proof });
        return verifiableCredential;
    };
    EIP712VC.prototype.getW3CCredentialTypedData = function (credential, issuerType, credentialSubjectTypes) {
        return {
            domain: this.getDomainTypedData(),
            primaryType: types_1.VERIFIABLE_CREDENTIAL_PRIMARY_TYPE,
            message: credential,
            types: (0, tslib_1.__assign)((0, tslib_1.__assign)({ EIP712Domain: types_1.DOMAIN_TYPE, VerifiableCredential: types_1.VERIFIABLE_CREDENTIAL_W3C_TYPE, CredentialSchema: types_1.CREDENTIAL_SCHEMA_W3C_TYPE }, credentialSubjectTypes), { Issuer: issuerType }),
        };
    };
    EIP712VC.prototype.verifyW3CCredential = function (issuer, credentialTypedData, proofValue) {
        var data = credentialTypedData;
        var recoveredAddress = (0, eth_sig_util_1.recoverTypedSignature_v4)({
            data: data,
            sig: proofValue,
        });
        return getAddress(issuer) === getAddress(recoveredAddress);
    };
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
    EIP712VC.prototype.createEIP712VerifiableCredential = function (privateKey, credentialTypedData) {
        var data = credentialTypedData;
        var signature = (0, eth_sig_util_1.signTypedData_v4)(Buffer.from(privateKey.slice(2), 'hex'), { data: data });
        var credential = (0, tslib_1.__assign)({}, credentialTypedData.message);
        var proof = (0, tslib_1.__assign)((0, tslib_1.__assign)({ verificationMethod: credentialTypedData.message.issuer.id + "#ethereumAddress", ethereumAddress: credentialTypedData.message.issuer.ethereumAddress, created: new Date(Date.now()).toISOString(), proofPurpose: 'assertionMethod', type: 'EthereumEip712Signature2021' }, credentialTypedData.message.proof), { proofValue: signature, eip712: {
                domain: (0, tslib_1.__assign)({}, data.domain),
                types: (0, tslib_1.__assign)({}, data.types),
                primaryType: data.primaryType,
            } });
        var verifiableCredential = (0, tslib_1.__assign)((0, tslib_1.__assign)({}, credential), { proof: proof });
        return verifiableCredential;
    };
    EIP712VC.prototype.getEIP712CredentialTypedData = function (credential, issuerType, credentialSubjectTypes) {
        return {
            domain: this.getDomainTypedData(),
            primaryType: types_1.VERIFIABLE_CREDENTIAL_PRIMARY_TYPE,
            message: credential,
            types: (0, tslib_1.__assign)((0, tslib_1.__assign)({ EIP712Domain: types_1.DOMAIN_TYPE, VerifiableCredential: types_1.VERIFIABLE_CREDENTIAL_EIP712_TYPE, CredentialSchema: types_1.CREDENTIAL_SCHEMA_EIP712_TYPE }, credentialSubjectTypes), { Issuer: issuerType }),
        };
    };
    EIP712VC.prototype.verifyEIP712Credential = function (issuer, credentialTypedData, proofValue) {
        var data = credentialTypedData;
        var recoveredAddress = (0, eth_sig_util_1.recoverTypedSignature_v4)({
            data: data,
            sig: proofValue,
        });
        return getAddress(issuer) === getAddress(recoveredAddress);
    };
    return EIP712VC;
}());
exports.EIP712VC = EIP712VC;
//# sourceMappingURL=eip712vc.js.map