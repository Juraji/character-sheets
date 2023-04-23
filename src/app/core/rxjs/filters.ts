import {filter, first, Observable, pipe, UnaryFunction} from 'rxjs'

/**
 * Filter NULL or undefined values
 */
export const filterNotNull: <T>() => UnaryFunction<Observable<T>, Observable<NonNullable<T>>> = () => pipe(
    filter(o => o !== null && o !== undefined) as never
);

/**
 * Filter NULL, undefined or empty arrays or strings
 */
export const filterNotEmpty: <T, U extends T[] | string>() => UnaryFunction<Observable<U>, Observable<U>> = () => pipe(
    filter(o => o.length > 0)
);

export const firstNotNull: <T>() => UnaryFunction<Observable<T>, Observable<NonNullable<T>>> = () => pipe(
    first(),
    filterNotNull()
);
