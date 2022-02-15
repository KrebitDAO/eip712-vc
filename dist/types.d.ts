export declare const DOMAIN_ENCODING = "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)";
export interface EIP712Config {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
}
export declare type Signature = string;
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
export interface CredentialStatus {
    id: string;
    type: string;
}
/**
 * used as input when creating Verifiable Credentials
 */
interface FixedCredentialPayload {
    '@context': string | string[];
    id: string;
    type: string | string[];
    issuer: IssuerType;
    issuanceDate: DateType;
    expirationDate?: DateType;
    credentialSubject: Extensible<{
        id?: string;
    }>;
    credentialStatus?: CredentialStatus;
    evidence?: any;
    termsOfUse?: any;
}
/**
 * A more flexible representation of a {@link W3CCredential} that can be used as input to methods
 * that expect it.
 */
export declare type CredentialPayload = Extensible<FixedCredentialPayload>;
/**
 * This is meant to reflect unambiguous types for the properties in `CredentialPayload`
 */
interface NarrowCredentialDefinitions {
    '@context': string[];
    type: string[];
    issuer: Exclude<IssuerType, string>;
    issuanceDate: string;
    expirationDate?: string;
}
/**
 * Replaces the matching property types of T with the ones in U
 */
declare type Replace<T, U> = Omit<T, keyof U> & U;
/**
 * This data type represents a parsed VerifiableCredential.
 * It is meant to be an unambiguous representation of the properties of a Credential and is usually the result of a transformation method.
 *
 * `issuer` is always an object with an `id` property and potentially other app specific issuer claims
 * `issuanceDate` is an ISO DateTime string
 * `expirationDate`, is a nullable ISO DateTime string
 *
 * Any JWT specific properties are transformed to the broader W3C variant and any app specific properties are left intact
 */
export declare type W3CCredential = Extensible<Replace<FixedCredentialPayload, NarrowCredentialDefinitions>>;
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
export declare type VerifiableCredential = Verifiable<W3CCredential>;
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
export declare type SignTypedData<T extends EIP712MessageTypes> = (data: EIP712TypedData<T>) => Promise<Signature>;
export declare type VerifyTypedData<T extends EIP712MessageTypes> = (data: EIP712TypedData<T>, proofValue: string) => Promise<string>;
export {};
