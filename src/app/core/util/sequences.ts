import {v4 as uuidV4} from 'uuid'

export const generateSequence = function* <T>(seed: T, next: (previous: T) => Nullable<T>) {
    let previous: Nullable<T> = seed

    do {
        yield previous
        previous = next(previous as T)
    } while (previous !== null && previous !== undefined)
}

export const numberSequence = (until: number) => generateSequence(0, p => p < until ? p + 1 : null)

export const uuidGenerator: (short?: boolean) => Generator<string, void> = function* (short = false) {
    if (short) while (true) yield uuidV4().substring(0, 7)
    else while (true) yield uuidV4()
}
