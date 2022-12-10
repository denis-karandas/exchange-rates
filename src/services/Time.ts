export const convertHoursToMilliseconds = (value: number): number => {
    return value ? value * 60 * 60 * 1000 : 0;
}

export default { convertHoursToMilliseconds };
