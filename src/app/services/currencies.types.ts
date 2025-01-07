export interface GenericResponse<T> {
    status: unknown;
    data: T;
}

export interface QuoteData {
    price: number;
    market_cap: number;
}

export interface Currency {
    id: number;
    name: string;
    circulating_supply: number;
    quote: Record<string, QuoteData>;
}
