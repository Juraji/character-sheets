import {v4 as uuidV4} from 'uuid'

import {isNotNullable} from '@core/util/objects';

export const generateSequence = function* <T>(seed: T, next: (previous: T) => Optional<T>): Generator<T, void> {
    let previous: Optional<T> = seed

    do {
        yield previous as T
        previous = next(previous as T)
    } while (isNotNullable(previous))
}

export const generateArray = <T>(seed: T, next: (previous: T) => Optional<T>): T[] =>
    Array.from(generateSequence(seed, next))

export const uuidGenerator: (short?: boolean) => Generator<string, void> = function* (short = false) {
    if (short) while (true) yield uuidV4().substring(0, 7)
    else while (true) yield uuidV4()
}
