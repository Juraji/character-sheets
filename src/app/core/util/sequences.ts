export const emptySequence = function* () {
}

export const generateSequence = <T>(seed: T, next: (previous: T) => T | null): Generator<T, void> => {
    return (function* () {
        let previous: T | null = seed

        do {
            yield previous
            previous = next(previous)
        } while (previous !== null)
    })()
}

export const numberSequence = (until: number) => generateSequence(0, p => p < until ? p + 1 : null)
