export interface Asset {
    id: number;
    name: string;
    symbol: string;
    amount: number;
}

export type AssetRaw = Omit<Asset, 'id'> & {
    id: string;
};

export interface Transaction {
    id: number;
    type: 'purchased' | 'traded';
    timestamp: number;
    asset: Asset;
}

export type TransactionRaw = Omit<Transaction, 'id'> & {
    id: string;
};

export interface TransactionData {
    asset: AssetRaw;
    transaction: TransactionRaw;
    isExistingAsset: boolean;
}
