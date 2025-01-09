export interface GenericResponse<T> {
    status: unknown;
    data: T;
}

export interface QuoteData {
    price: number;
    market_cap: number;
}

export interface CurrencyRaw {
    id: number;
    name: string;
    symbol: string;
    circulating_supply: number;
    quote: Record<string, QuoteData>;
}

export type Currency = Omit<CurrencyRaw, 'quote'> & QuoteData;
