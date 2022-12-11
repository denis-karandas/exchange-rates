import React from 'react';
import TimeService from 'services/Time';
import LocalStorageService from 'services/LocalStorage';
import { useFetch } from 'hooks/useFetch';
import { apiUrl, localStorageKey, reFetchHourInterval } from './config';
import { IExchangeRatesResponse, ILocalStorageExchangeRates, IUseExchangeRatesResponse } from './models';

export const useExchangeRates = (): IUseExchangeRatesResponse => {
    const exchangeRatesFromLocalStorage = LocalStorageService.get<ILocalStorageExchangeRates>(localStorageKey);

    const intervalRef = React.useRef<any>(null);
    const localStorageMillisecondsLeftToReFetchRef = React.useRef<any>(exchangeRatesFromLocalStorage?.millisecondsLeftToReFetch);

    const clearIntervalFunc = React.useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }, []);

    const setDelayedCallback = React.useCallback((callback: () => void) => {
        clearIntervalFunc();

        intervalRef.current = setInterval(() => {
            if (localStorageMillisecondsLeftToReFetchRef.current <= 0) {
                callback();
            }
            else {
                localStorageMillisecondsLeftToReFetchRef.current -= 1000;
            }
        }, 1000);
    }, [clearIntervalFunc]);

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
        const millisecondsLeftToReFetch = TimeService.convertHoursToMilliseconds(reFetchHourInterval);

        makeRequest({
            onSuccess: (exchangeRates: IExchangeRatesResponse[]) => {
                LocalStorageService.set<ILocalStorageExchangeRates>(localStorageKey, {
                    millisecondsLeftToReFetch,
                    data: exchangeRates,
                });
            },
            onFinally: () => {
                localStorageMillisecondsLeftToReFetchRef.current = millisecondsLeftToReFetch;
                setDelayedCallback(fetchExchangeRates);
            },
        });
    }, [makeRequest, setDelayedCallback]);

    const beforeunloadEvent = React.useCallback(() => {
        const exchangeRatesFromLocalStorageBeforeUnload = LocalStorageService.get<ILocalStorageExchangeRates>(localStorageKey);
        
        LocalStorageService.set<ILocalStorageExchangeRates>(localStorageKey, {
            millisecondsLeftToReFetch: localStorageMillisecondsLeftToReFetchRef.current,
            data: exchangeRatesFromLocalStorageBeforeUnload?.data || null,
        });
    }, []);

    React.useEffect(() => {
        window.addEventListener('beforeunload', beforeunloadEvent);

        return () => {
            window.removeEventListener('beforeunload', beforeunloadEvent);
        };
    }, [beforeunloadEvent]);

    React.useEffect(() => {
        if (localStorageMillisecondsLeftToReFetchRef.current !== undefined) {
            setDelayedCallback(fetchExchangeRates);
        }
    }, [fetchExchangeRates, setDelayedCallback]);

    return { data, error, isFetching, fetchExchangeRates };
};
