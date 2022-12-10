import React from 'react';
import { IMakeRequestParams, IUseFetchParams, IUseFetchResponse, Type } from './models';

export function useFetch<T>({
    url,
    type = Type.json,
    initialData = null,
}: IUseFetchParams<T>): IUseFetchResponse<T> {
    const [data, setData] = React.useState<T | null>(initialData);
    const [error, setError] = React.useState<any>(null);
    const [isFetching, setIsFetching] = React.useState<boolean>(false);

    const formatResponse = React.useCallback((response: Response) => {
        switch (type) {
            case Type.json:
                return response.json();
            case Type.text:
                return response.text();
            default:
                return null;
        }
    }, [type]);

    const makeRequest = React.useCallback(({ onSuccess, onError, onFinally }: IMakeRequestParams<T>) => {
        setData(null);
        setError(null);
        setIsFetching(true);

        fetch(url)
            .then(formatResponse)
            .then((responseData: T) => {
                setData(responseData);
                onSuccess?.(responseData);
            })
            .catch((error) => {
                setError(error);
                onError?.(error);
            })
            .finally(() => {
                setIsFetching(false);
                onFinally?.();
            });
    }, [url, formatResponse]);

    return { data, error, isFetching, makeRequest };
}
