import React from 'react';
import TimeService from 'services/Time';
import { IExchangeRateResponse, ILocalStorageExchangeRate, IUseExchangeRateResponse } from './models';
import { getParsedJsonFromLocalStorage, setConvertedJsonInLocalStorage } from './helpers';
import { apiUrl, localStorageKey, reFetchHourInterval } from './config';

export const useExchangeRate = (): IUseExchangeRateResponse => {
    const exchangeRateFromLocalStorage = getParsedJsonFromLocalStorage<ILocalStorageExchangeRate>(localStorageKey);

    const [data, setData] = React.useState<IExchangeRateResponse[] | null>(exchangeRateFromLocalStorage?.data);
    const [error, setError] = React.useState<any>(null);
    const [isFetching, setIsFetching] = React.useState<boolean>(false);

    const timeoutRef = React.useRef<any>(null);
    const localStorageTimestampRef = React.useRef<any>(exchangeRateFromLocalStorage?.timestamp);

    const clearTimeoutFunc = React.useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    const startTimer = React.useCallback((callback: () => void, nextReFetchTimestamp: number) => {
        clearTimeoutFunc();

        timeoutRef.current = setTimeout(callback, nextReFetchTimestamp - Date.now());
    }, [clearTimeoutFunc]);

    const saveExchangeRateInLocalStorage = (timestamp: number, values: IExchangeRateResponse[]) => {
        setConvertedJsonInLocalStorage(localStorageKey, { timestamp, data: values });
    };

    const fetchExchangeRate = React.useCallback(() => {
        setData(null);
        setError(null);
        setIsFetching(true);

        fetch(apiUrl)
            .then((response: Response) => response.json())
            .then((exchangeRate: IExchangeRateResponse[]) => {
                const nextReFetchTimeInMilliseconds = Date.now() + TimeService.convertHoursToMilliseconds(reFetchHourInterval);

                saveExchangeRateInLocalStorage(nextReFetchTimeInMilliseconds, exchangeRate);
                setData(exchangeRate);

                startTimer(fetchExchangeRate, nextReFetchTimeInMilliseconds);
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setIsFetching(false);
            });
    }, [setData, setError, setIsFetching, startTimer]);

    React.useEffect(() => {
        if (localStorageTimestampRef.current) {
            startTimer(fetchExchangeRate, localStorageTimestampRef.current);
        }
    }, [fetchExchangeRate, startTimer]);

    return { data, error, isFetching, fetchExchangeRate };
};
