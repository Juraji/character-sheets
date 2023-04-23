import {catchError, finalize, MonoTypeOperatorFunction, pipe, tap, throwError} from 'rxjs'

export const debugRx: <T>(label?: string) => MonoTypeOperatorFunction<T> = label => {
    const l = label ?? 'debugRx'

    return pipe(
        tap({
            subscribe: () => console.log(`${l}: New subscriber`),
            unsubscribe: () => console.log(`${l}: Subscriber left`),
            complete: () => console.log(`${l}: Completed`),
        }),
        catchError((e) => {
            console.error(`${l}: Caught error`, e)
            return throwError(e)
        }),
        tap(next => console.log(`${l}: next`, next)),
        finalize(() => console.log(`${l}: Finalized`))
    )
}
