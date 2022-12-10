export function get<T>(key: string): T | null {
    const value = localStorage.getItem(key);

    return value
        ? JSON.parse(value)
        : null;
}

export function set<T>(key: string, data: T): void {
    localStorage.setItem(key, JSON.stringify(data));
}

export default { get, set };
