export interface Token {
    name: string,
    publicKey: string
}

export interface TransactionLog {
    tokenName: string,
    tokenAddress: string,
    profit: number,
    time: string
    address?: string
}