import {filter, first, Observable, pipe, UnaryFunction} from 'rxjs'

import {isNotNullable} from '@core/util/objects';

/**
 * Filter NULL or undefined values
 */
export const filterNotNull: <T>() => UnaryFunction<Observable<T>, Observable<NonNullable<T>>> = () => pipe(
    filter(isNotNullable) as never
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
