export enum Type {
    json = 'json',
    text = 'text',
}

export interface IUseFetchParams<T> {
    url: string;
    initialData?: T | null;
    type?: Type;
}

export interface IMakeRequestParams<T> {
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;

    onFinally?: () => void;
}

export interface IUseFetchResponse<T> {
    data: T | null;
    error: any;
    isFetching: boolean;
    makeRequest: (params: IMakeRequestParams<T>) => void;
}
