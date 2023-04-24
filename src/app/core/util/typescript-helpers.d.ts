type Optional<T> = T | null | undefined

/**
 * Complex Partial type:
 * - By default all properties are marked as both optional (undefined/?) and nullable.
 * - When specific properties are supplied to K, only those properties are updated, other properties remain unchanged.
 */
type Nullable<T, K extends keyof T = keyof T, OPT = Pick<T, K>, REQ = Omit<T, K>> = {
    [P in keyof OPT]: Optional<OPT[P]>
} & {
    [P in keyof REQ]: REQ[P]
}

