type SortFn<T> = (a: T, b: T) => number

const mappedSort = <T, R>(mapper: (o: T) => R, sortFn: SortFn<R>, defaultValue: R): SortFn<T> =>
    (a, b) => sortFn(mapper(a) ?? defaultValue, mapper(b) ?? defaultValue)

export const chainSort = <T>(...sorts: SortFn<T>[]): SortFn<T> =>
    (a, b) => sorts.reduce((acc, next) => acc || next(a, b), 0)

export const orderedSort = <T, R>(mapper: (o: T) => R, ...order: R[]): SortFn<T> =>
    mappedSort(mapper, (a, b) => {
        if (a === b) return 0

        const idxOfA = order.indexOf(a as R)
        const idxOfB = order.indexOf(b as R)

        if (idxOfA === idxOfB) return 0;
        else if (idxOfA === -1) return 1;
        else if (idxOfB === -1) return -1;
        else return idxOfA - idxOfB
    }, null);

export const booleanSort = <T>(mapper: (o: T) => boolean, desc = false): SortFn<T> =>
    orderedSort(mapper, desc, !desc)

const intlCollatorOpts: Intl.CollatorOptions = {numeric: true, sensitivity: 'base'};
export const strSort = <T>(mapper: (o: T) => string | null | undefined, desc = false, nullsLast = true): SortFn<T> => {
    const fallback = nullsLast ? Number.MAX_VALUE : Number.MIN_VALUE
    return mappedSort(mapper, (a, b) => desc
        ? b?.localeCompare(a as string, undefined, intlCollatorOpts) ?? fallback
        : a?.localeCompare(b as string, undefined, intlCollatorOpts) ?? fallback, null)
};

export const numberSort = <T>(mapper: (o: T) => number, desc = false, nullsLast = true): SortFn<T> =>
    mappedSort(
        mapper,
        (a, b) => desc ? b - a : a - b,
        nullsLast ? Number.MAX_VALUE : Number.MIN_VALUE
    );
