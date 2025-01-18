export interface Asset {
    id: number;
    name: string;
    symbol: string;
    amount: number;
}

export type AssetRaw = Asset & {
    id: string;
};
