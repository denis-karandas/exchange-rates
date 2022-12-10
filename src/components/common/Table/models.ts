export interface ITable<T> {
    headers: string[];
    data: T[];
    renderRow: (row: T) => React.ReactNode;
}
