import {map, OperatorFunction} from 'rxjs';

export const mapList: <T, R>(op: (next: T) => R) => OperatorFunction<Iterable<T>, R[]> =
    op => map(arr => Array.from(arr).map(op))
