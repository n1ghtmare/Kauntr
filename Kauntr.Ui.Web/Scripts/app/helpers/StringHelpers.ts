export function pluralizeNaive(n: number, word: string): string {
    return (n > 1 || n === 0) ? (word + "s") : word;
}