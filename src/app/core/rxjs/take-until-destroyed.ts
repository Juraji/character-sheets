import {OnDestroy} from '@angular/core';
import {MonoTypeOperatorFunction, Observable, pipe, Subject, takeUntil} from 'rxjs';

interface DestroyableDirective extends OnDestroy {
    destroy$?: Observable<void>
}

export const takeUntilDestroyed: <T>(directive: DestroyableDirective) => MonoTypeOperatorFunction<T> = directive => {
    if (directive.destroy$ === undefined) {
        const destroy$ = directive.destroy$ = new Subject<void>()
        const orgDestroy = directive.ngOnDestroy;

        directive.ngOnDestroy = () => {
            destroy$.next()
            destroy$.complete()
            directive.destroy$ = undefined;

            orgDestroy.apply(directive);
        }
    }

    return pipe(takeUntil(directive.destroy$))
}
