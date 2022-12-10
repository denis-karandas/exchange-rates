export interface IUseExchangeRatesResponse {
    data: IExchangeRatesResponse[] | null;
    error: any;
    isFetching: boolean;
    fetchExchangeRates: () => void;
}

export interface IExchangeRatesResponse {
    r030: number;
    cc: string;
    rate: number;
    txt: string;
    exchangedate: string;
}

export interface ILocalStorageExchangeRates {
    timestamp: number;
    data: IExchangeRatesResponse[];
}