export function getParsedJsonFromLocalStorage<T>(key: string): T {
    const value = localStorage.getItem(key);

    return value
        ? JSON.parse(value)
        : null;
}

export function setConvertedJsonInLocalStorage<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
}
