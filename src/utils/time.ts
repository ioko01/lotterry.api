export function GMT(gmt?: number): Date;
export function GMT(number: number = 7): Date {
    return new Date(Date.now() + 1000 * 60 * 60 * number);
}
