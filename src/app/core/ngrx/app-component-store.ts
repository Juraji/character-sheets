import {EnvironmentInjector, inject} from '@angular/core'
import {ActivatedRoute, ResolveFn, Router} from '@angular/router'
import {ComponentStore} from '@ngrx/component-store'
import {Comparer, createEntityAdapter, EntityAdapter, IdSelector} from '@ngrx/entity'
import {isObservable, ObservableInput} from 'rxjs'

import {DatabaseService} from '@core/db/database.service'

export type AppEntityAdapter<T, ADP extends EntityAdapter<T> = EntityAdapter<T>, SEL = ReturnType<ADP['getSelectors']>> =
    Omit<ADP, 'getSelectors'> & { [P in keyof SEL]: SEL[P] }

export abstract class AppComponentStore<T extends object> extends ComponentStore<T> {
    protected readonly db: DatabaseService
    protected readonly injector: EnvironmentInjector
    protected readonly activatedRoute: ActivatedRoute
    protected readonly router: Router

    protected constructor(defaultState?: T) {
        super(defaultState)

        this.db = inject(DatabaseService)
        this.injector = inject(EnvironmentInjector)
        this.activatedRoute = inject(ActivatedRoute)
        this.router = inject(Router)
    }

    protected createEntityAdapter<T>(selectId: IdSelector<T>, sortComparer?: Comparer<T>): AppEntityAdapter<T> {
        const adapter: EntityAdapter<T> = createEntityAdapter<T>({selectId, sortComparer})
        return {...adapter, ...adapter.getSelectors()} as AppEntityAdapter<T>
    }

    protected runResolve<R>(resolve: ResolveFn<R>): ObservableInput<R> {
        const routerStateSnapshot = this.router.routerState.snapshot
        const resolved = this.injector.runInContext(() => resolve(this.activatedRoute.snapshot, routerStateSnapshot))
        return !!resolved && (isObservable(resolved) || typeof (resolved as Promise<unknown>).then === 'function')
            ? resolved as ObservableInput<R>
            : [resolved] as ObservableInput<R>
    }
}
