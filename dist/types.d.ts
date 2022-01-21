/// <reference types="node" />
import { W3CCredential } from 'did-jwt-vc';
export declare const DOMAIN_ENCODING = "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)";
export interface EIP712Config {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
}
export declare type Signature = {
    v: number;
    r: Buffer;
    s: Buffer;
};
export interface TypedData {
    name: string;
    type: 'bool' | 'uint8' | 'uint16' | 'uint32' | 'uint64' | 'uint128' | 'uint256' | 'address' | 'string' | 'string[]' | 'bytes' | 'bytes32' | 'Issuer' | 'CredentialSubject' | 'CredentialSchema' | 'Proof';
}
export declare const DOMAIN_TYPE: TypedData[];
export interface EIP712DomainTypedData {
    chainId: number;
    name: string;
    verifyingContract: string;
    version: string;
}
export interface EIP712MessageTypes {
    EIP712Domain: TypedData[];
    [additionalProperties: string]: TypedData[];
}
export interface EIP712TypedData<T extends EIP712MessageTypes> {
    types: T;
    primaryType: keyof T;
    domain: EIP712DomainTypedData;
    message: any;
}
export declare const VERIFIABLE_CREDENTIAL_PRIMARY_TYPE = "VerifiableCredential";
declare type Extensible<T> = T & {
    [x: string]: any;
};
export declare type IssuerType = Extensible<{
    id: string;
}>;
export declare type DateType = string | Date;
export interface CredentialSchema {
    id: string;
    _type: string;
}
export declare type EIP712CredentialPayload = {
    _context: string;
    _type: string;
    id: string;
    issuer: IssuerType;
    credentialSubject: Extensible<{
        id?: string;
    }>;
    credentialSchema?: CredentialSchema;
    issuanceDate: DateType;
    expirationDate?: DateType;
};
export declare type EIP712Credential = Extensible<EIP712CredentialPayload>;
export interface Proof {
    type?: string;
    [x: string]: any;
}
/**
 * Represents a readonly representation of a verifiable object, including the {@link Proof}
 * property that can be used to verify it.
 */
export declare type Verifiable<T> = Readonly<T> & {
    readonly proof: Proof;
};
export declare type EIP712VerifiableCredential = Verifiable<EIP712Credential>;
export interface EIP712CredentialMessageTypes extends EIP712MessageTypes {
    VerifiableCredential: typeof VERIFIABLE_CREDENTIAL_EIP712_TYPE;
    Issuer: any;
    CredentialSubject: any;
    CredentialSchema: typeof CREDENTIAL_SCHEMA_EIP712_TYPE;
    Proof: typeof PROOF_EIP712_TYPE;
}
export interface EIP712CredentialTypedData extends EIP712TypedData<EIP712CredentialMessageTypes> {
    message: EIP712Credential;
}
export declare const CREDENTIAL_SCHEMA_EIP712_TYPE: TypedData[];
export declare const VERIFIABLE_CREDENTIAL_EIP712_TYPE: TypedData[];
export declare const PROOF_EIP712_TYPE: TypedData[];
export interface W3CCredentialMessageTypes extends EIP712MessageTypes {
    VerifiableCredential: typeof VERIFIABLE_CREDENTIAL_W3C_TYPE;
    Issuer: any;
    CredentialSubject: any;
    CredentialSchema: typeof CREDENTIAL_SCHEMA_W3C_TYPE;
    Proof: typeof PROOF_W3C_TYPE;
}
export interface W3CCredentialTypedData extends EIP712TypedData<W3CCredentialMessageTypes> {
    message: W3CCredential;
}
export declare const CREDENTIAL_SCHEMA_W3C_TYPE: TypedData[];
export declare const VERIFIABLE_CREDENTIAL_W3C_TYPE: TypedData[];
export declare const PROOF_W3C_TYPE: TypedData[];
export {};
