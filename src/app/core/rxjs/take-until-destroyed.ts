import {OnDestroy} from '@angular/core';
import {MonoTypeOperatorFunction, Observable, pipe, Subject, takeUntil} from 'rxjs';

type ExtOnDestroy = OnDestroy & { destroy$?: Observable<void> };

export const takeUntilDestroyed: <T, C extends ExtOnDestroy>(directive: C) => MonoTypeOperatorFunction<T> =
    directive => {
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
