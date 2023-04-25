const buildPartialObj = <T extends object, K extends keyof T>(o: T, predicate: (key: K) => boolean) => {
    const copy: T = {} as T
    const objKeys: K[] = Object.keys(o) as K[]

    for (const k of objKeys)
        if (k in o && predicate(k))
            copy[k] = o[k]

    return copy
}

/**
 * Returns a new object with specified keys omitted.
 */
export const objectOmit = <T extends object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> =>
    buildPartialObj<T, K>(obj, k => !keys.includes(k))

/**
 * Returns a new object with only the specified properties
 */
export const objectPick = <T extends object, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> =>
    buildPartialObj<T, K>(obj, k => keys.includes(k))

/**
 * Returns a new object without null or undefined properties
 */
export const objectOmitNulls = <T extends Nullable<object>>(obj: T): Partial<T> =>
    buildPartialObj(obj, k => isNotNullable(obj[k]))

/**
 * convenience functions: Checks for both not undefined and not null
 */
export const isNullable = (obj: unknown): boolean => obj === undefined || obj === null
export const isNotNullable = (obj: unknown): boolean => obj !== undefined && obj !== null
