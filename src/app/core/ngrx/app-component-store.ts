import {EnvironmentInjector, inject} from '@angular/core'
import {ActivatedRoute, ResolveFn, Router} from '@angular/router'
import {ComponentStore} from '@ngrx/component-store'
import {Comparer, createEntityAdapter, EntityAdapter, EntityState, IdSelector} from '@ngrx/entity'
import {isObservable, map, ObservableInput, OperatorFunction} from 'rxjs'

import {DatabaseService} from '@core/db/database.service'

export type AppEntityAdapterOld<T, ADP extends EntityAdapter<T> = EntityAdapter<T>, SEL = ReturnType<ADP['getSelectors']>> =
    Omit<ADP, 'getSelectors'> & { [P in keyof SEL]: SEL[P] }

export interface AppEntityAdapter<T, ID extends string | number = string> extends EntityAdapter<T> {
    selectIds: OperatorFunction<EntityState<T>, ID[]>
    selectEntities: OperatorFunction<EntityState<T>, Record<ID, T>>
    selectAll: OperatorFunction<EntityState<T>, T[]>
    selectTotal: OperatorFunction<EntityState<T>, number>
}

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

    protected createEntityAdapter<T, ID extends string | number = string>(selectId: IdSelector<T>, sortComparer?: Comparer<T>): AppEntityAdapter<T, ID> {
        const adapter: EntityAdapter<T> = createEntityAdapter<T>({selectId, sortComparer})
        const selectors = adapter.getSelectors()
        return {
            ...adapter,
            selectIds: map(selectors.selectIds),
            selectEntities: map(selectors.selectEntities),
            selectAll: map(selectors.selectAll),
            selectTotal: map(selectors.selectTotal),
        } as AppEntityAdapter<T, ID>
    }

    protected runResolve<R>(resolve: ResolveFn<R>): ObservableInput<R> {
        const routerStateSnapshot = this.router.routerState.snapshot
        const resolved = this.injector.runInContext(() => resolve(this.activatedRoute.snapshot, routerStateSnapshot))
        return !!resolved && (isObservable(resolved) || typeof (resolved as Promise<unknown>).then === 'function')
            ? resolved as ObservableInput<R>
            : [resolved] as ObservableInput<R>
    }
}
