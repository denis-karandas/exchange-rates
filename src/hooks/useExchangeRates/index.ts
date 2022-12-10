import React from 'react';
import TimeService from 'services/Time';
import LocalStorageService from 'services/LocalStorage';
import { useFetch } from 'hooks/useFetch';
import { apiUrl, localStorageKey, reFetchHourInterval } from './config';
import { IExchangeRatesResponse, ILocalStorageExchangeRates, IUseExchangeRatesResponse } from './models';

export const useExchangeRates = (): IUseExchangeRatesResponse => {
    const exchangeRatesFromLocalStorage = LocalStorageService.get<ILocalStorageExchangeRates>(localStorageKey);

    const timeoutRef = React.useRef<any>(null);
    const localStorageTimestampRef = React.useRef<any>(exchangeRatesFromLocalStorage?.timestamp);

    const clearTimeoutFunc = React.useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    const setDelayedCallback = React.useCallback((callback: () => void, nextReFetchTimeInMilliseconds: number) => {
        clearTimeoutFunc();

        timeoutRef.current = setTimeout(callback, nextReFetchTimeInMilliseconds - Date.now());
    }, [clearTimeoutFunc]);

    const {
        data,
        error,
        isFetching,
        makeRequest
    } = useFetch<IExchangeRatesResponse[]>({
        url: apiUrl,
        initialData: exchangeRatesFromLocalStorage?.data || null
    });

    const fetchExchangeRates = React.useCallback(() => {
        const nextReFetchTimeInMilliseconds = Date.now() + TimeService.convertHoursToMilliseconds(reFetchHourInterval);

        makeRequest({
            onSuccess: (exchangeRates: IExchangeRatesResponse[]) => {
                LocalStorageService.set<ILocalStorageExchangeRates>(localStorageKey, {
                    timestamp: nextReFetchTimeInMilliseconds,
                    data: exchangeRates,
                });
            },
            onFinally: () => {
                setDelayedCallback(fetchExchangeRates, nextReFetchTimeInMilliseconds);
            },
        });
    }, [makeRequest, setDelayedCallback]);

    React.useEffect(() => {
        if (localStorageTimestampRef.current) {
            setDelayedCallback(fetchExchangeRates, localStorageTimestampRef.current);
        }
    }, [fetchExchangeRates, setDelayedCallback]);

    return { data, error, isFetching, fetchExchangeRates };
};
