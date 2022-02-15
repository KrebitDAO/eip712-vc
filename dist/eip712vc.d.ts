import { EIP712Config, EIP712DomainTypedData, W3CCredential, CredentialPayload, VerifiableCredential, EIP712CredentialTypedData, EIP712MessageTypes, EIP712Credential, EIP712VerifiableCredential, W3CCredentialTypedData, SignTypedData, VerifyTypedData, EIP712TypedData } from './types';
export { EIP712Config, EIP712MessageTypes, EIP712CredentialTypedData, EIP712TypedData, CredentialPayload, VerifiableCredential, EIP712VerifiableCredential, W3CCredential, W3CCredentialTypedData, SignTypedData, VerifyTypedData, };
export declare const DEFAULT_CONTEXT = "https://www.w3.org/2018/credentials/v1";
export declare const EIP712_CONTEXT = "https://raw.githubusercontent.com/w3c-ccg/ethereum-eip712-signature-2021-spec/main/contexts/v1/index.json";
export declare const DEFAULT_VC_TYPE = "VerifiableCredential";
export declare function getKrebitCredentialTypes(): any;
export declare function getEIP712Credential(credential: W3CCredential): EIP712Credential;
export declare class EIP712VC {
    private eip712Config;
    constructor(eip712Config: EIP712Config);
    getDomainSeparator(): string;
    getDomainTypedData(): EIP712DomainTypedData;
    createW3CVerifiableCredential(credential: W3CCredential, credentialSubjectTypes: any, signTypedData: SignTypedData<EIP712MessageTypes>): Promise<VerifiableCredential>;
    getW3CCredentialTypedData(credential: W3CCredential, credentialSubjectTypes: any): W3CCredentialTypedData;
    verifyW3CCredential(issuer: string, credential: W3CCredential, credentialSubjectTypes: any, proofValue: string, verifyTypedData: VerifyTypedData<EIP712MessageTypes>): Promise<boolean>;
    /**
     * Creates a VerifiableCredential given a `EIP712CredentialTypedData`
     *
     * This method transforms the payload into the [EIP712 Typed Data](https://eips.ethereum.org/EIPS/eip-712)
     * described in the [W3C EIP712 VC spec](https://w3c-ccg.github.io/ethereum-eip712-signature-2021-spec) and then validated to conform to the minimum spec
     * required W3C spec.
     *
     * @param signTypedData `Issuer` the DID, signer and algorithm that will sign the token
     * @param credentialTypedData `EIP712CredentialTypedData`
     * @return a `Promise` that resolves to the verifiable credential or rejects with `TypeError` if the
     * `payload` is not W3C compliant
     */
    createEIP712VerifiableCredential(credential: EIP712Credential, credentialSubjectTypes: any, signTypedData: SignTypedData<EIP712MessageTypes>): Promise<EIP712VerifiableCredential>;
    getEIP712CredentialTypes(credentialSubjectTypes: any): EIP712CredentialTypedData;
    getEIP712CredentialTypedData(credential: EIP712Credential, credentialSubjectTypes: any): EIP712CredentialTypedData;
    verifyEIP712Credential(issuer: string, credential: EIP712Credential, credentialSubjectTypes: any, proofValue: string, verifyTypedData: VerifyTypedData<EIP712MessageTypes>): Promise<boolean>;
}
