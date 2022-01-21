import { EIP712Config, EIP712DomainTypedData, EIP712CredentialTypedData, EIP712Credential, EIP712VerifiableCredential, W3CCredentialTypedData } from './types';
import { CredentialPayload, PresentationPayload, VerifiableCredential, W3CCredential, W3CPresentation, Verifiable } from 'did-jwt-vc';
export { EIP712Config, CredentialPayload, PresentationPayload, VerifiableCredential, EIP712VerifiableCredential, Verifiable, W3CCredential, W3CPresentation, };
export declare const DEFAULT_CONTEXT = "https://www.w3.org/2018/credentials/v1";
export declare const EIP712_CONTEXT = "https://raw.githubusercontent.com/w3c-ccg/ethereum-eip712-signature-2021-spec/main/contexts/v1/index.json";
export declare const DEFAULT_VC_TYPE = "VerifiableCredential";
export declare class EIP712VC {
    private eip712Config;
    constructor(eip712Config: EIP712Config);
    getDomainSeparator(): string;
    getDomainTypedData(): EIP712DomainTypedData;
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
    createW3CVerifiableCredential(privateKey: string, credentialTypedData: W3CCredentialTypedData): VerifiableCredential;
    getW3CCredentialTypedData(credential: W3CCredential, issuerType: any, credentialSubjectTypes: any): W3CCredentialTypedData;
    verifyW3CCredential(issuer: string, credentialTypedData: W3CCredentialTypedData, proofValue: string): boolean;
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
    createEIP712VerifiableCredential(privateKey: string, credentialTypedData: EIP712CredentialTypedData): EIP712VerifiableCredential;
    getEIP712CredentialTypedData(credential: EIP712Credential, issuerType: any, credentialSubjectTypes: any): EIP712CredentialTypedData;
    verifyEIP712Credential(issuer: string, credentialTypedData: EIP712CredentialTypedData, proofValue: string): boolean;
}
