import React from 'react';
import TimeService from 'services/Time';
import LocalStorageService from 'services/LocalStorage';
import { useFetch } from 'hooks/useFetch';
import { apiUrl, localStorageKey, reFetchHourInterval } from './config';
import { IExchangeRateResponse, ILocalStorageExchangeRate, IUseExchangeRateResponse } from './models';

export const useExchangeRate = (): IUseExchangeRateResponse => {
    const exchangeRateFromLocalStorage = LocalStorageService.get<ILocalStorageExchangeRate>(localStorageKey);

    const timeoutRef = React.useRef<any>(null);
    const localStorageTimestampRef = React.useRef<any>(exchangeRateFromLocalStorage?.timestamp);

    const clearTimeoutFunc = React.useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    const setIntervalAction = React.useCallback((callback: () => void, nextReFetchTimestamp: number) => {
        clearTimeoutFunc();

        timeoutRef.current = setTimeout(callback, nextReFetchTimestamp - Date.now());
    }, [clearTimeoutFunc]);

    const {
        data,
        error,
        isFetching,
        makeRequest
    } = useFetch<IExchangeRateResponse[]>({
        url: apiUrl,
        initialData: exchangeRateFromLocalStorage?.data || null
    });

    const fetchExchangeRate = React.useCallback(() => {
        const nextReFetchTimeInMilliseconds = Date.now() + TimeService.convertHoursToMilliseconds(reFetchHourInterval);

        makeRequest({
            onSuccess: (exchangeRate: IExchangeRateResponse[]) => {
                LocalStorageService.set<ILocalStorageExchangeRate>(localStorageKey, {
                    timestamp: nextReFetchTimeInMilliseconds,
                    data: exchangeRate,
                });
            },
            onFinally: () => {
                setIntervalAction(fetchExchangeRate, nextReFetchTimeInMilliseconds);
            },
        });
    }, [makeRequest, setIntervalAction]);

    React.useEffect(() => {
        if (localStorageTimestampRef.current) {
            setIntervalAction(fetchExchangeRate, localStorageTimestampRef.current);
        }
    }, [fetchExchangeRate, setIntervalAction]);

    return { data, error, isFetching, fetchExchangeRate };
};
