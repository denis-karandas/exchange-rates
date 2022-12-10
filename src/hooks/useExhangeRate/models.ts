export interface IUseExchangeRateResponse {
    data: IExchangeRateResponse[] | null;
    error: any;
    isFetching: boolean;

    fetchExchangeRate: () => void;
}

export interface IExchangeRateResponse {
    r030: number;
    cc: string;
    rate: number;
    txt: string;
    exchangedate: string;
}

export interface ILocalStorageExchangeRate {
    timestamp: number;
    data: IExchangeRateResponse[];
}