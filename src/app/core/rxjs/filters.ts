import {filter, Observable, pipe, UnaryFunction} from 'rxjs'

/**
 * Filter NULL or undefined values
 */
export const filterNotNull: <T>() => UnaryFunction<Observable<T>, Observable<NonNullable<T>>> = () => pipe(
    filter(o => o !== null && o !== undefined) as never
);

/**
 * Filter NULL, undefined or empty arrays or strings
 */
export const filterNotEmpty: <T, U extends T[] | string>() => UnaryFunction<Observable<U>, Observable<NonNullable<U>>> = () => pipe(
    filter(o => o !== null && o !== undefined && o.length > 0)
);
