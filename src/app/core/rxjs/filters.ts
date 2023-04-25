import {filter, first, MonoTypeOperatorFunction, OperatorFunction, pipe} from 'rxjs'

import {isNotNullable} from '@core/util/objects';

/**
 * Filter NULL or undefined values
 */
export const filterNotNull: <T>() => OperatorFunction<T, NonNullable<T>> = () => pipe(
    filter(isNotNullable) as never
);

/**
 * Filter NULL, undefined or empty arrays or strings
 */
export const filterNotEmpty: <T, U extends T[] | string>() => MonoTypeOperatorFunction<U> = () => pipe(
    filter(o => o.length > 0)
);

export const firstNotNull: <T>() => OperatorFunction<T, NonNullable<T>> = () => pipe(
    first(),
    filterNotNull()
);
