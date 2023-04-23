const buildPartialObj = <T extends object, K extends keyof T>(o: T, predicate: (key: K) => boolean) => {
    const copy: T = {} as T
    const objKeys: K[] = Object.keys(o) as K[]

    for (const k of objKeys)
        if (k in o && predicate(k))
            copy[k] = o[k]

    return copy
}

export const objectOmit = <T extends object, K extends keyof T>(o: T, ...keys: K[]): Omit<T, K> =>
    buildPartialObj<T, K>(o, k => !keys.includes(k))

export const objectPick = <T extends object, K extends keyof T>(o: T, ...keys: K[]): Pick<T, K> =>
    buildPartialObj<T, K>(o, k => keys.includes(k))
