import {Injectable} from '@angular/core';
import {EntityState} from '@ngrx/entity';
import {map, mergeMap, Observable, takeUntil, tap} from 'rxjs';

import {AppComponentStore, AppEntityAdapter} from '@core/ngrx';
import {filterNotNull} from '@core/rxjs';
import {strSort} from '@core/util/sorters';
import {DbReplicationService, SettingsService} from '@db/query';

interface SettingsStoreState {
    // CouchDB Synchronization
    couchDbSyncUri: Optional<string>,

    // Combat Class Names
    combatClassNames: EntityState<string>

    // Combat Class Names
    speciesNames: EntityState<string>
}

export interface SettingsStoreData {
    couchDbSyncUri: Optional<string>,
    combatClassNames: string[]
    speciesNames: string[]
}

@Injectable()
export class SettingsStore extends AppComponentStore<SettingsStoreState> {

    private readonly stringsAdapter: AppEntityAdapter<string> = this.createEntityAdapter(e => e, strSort(e => e))

    public readonly couchDbSyncEnabled$: Observable<boolean> = this
        .select(s => !!s.couchDbSyncUri)
    public readonly couchDbSyncUri$: Observable<Optional<string>> = this
        .select(s => s.couchDbSyncUri)
        .pipe(filterNotNull(), map(uri => {
            const uriObj = new URL(uri)
            if (!!uriObj.username) uriObj.username = '***'
            if (!!uriObj.password) uriObj.password = '***'
            return uriObj.toString()
        }))

    public readonly combatClassNames$: Observable<string[]> = this
        .select(s => s.combatClassNames)
        .pipe(this.stringsAdapter.selectAll)
    public readonly speciesNames$: Observable<string[]> = this
        .select(s => s.speciesNames)
        .pipe(this.stringsAdapter.selectAll)

    constructor(
        private readonly dbReplicationService: DbReplicationService,
        private readonly settings: SettingsService
    ) {
        super();

        this.setState({
            couchDbSyncUri: null,
            combatClassNames: this.stringsAdapter.getInitialState(),
            speciesNames: this.stringsAdapter.getInitialState()
        })

        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$), map(d => d['storeData']))
            .subscribe(sd => this.setStoreData(sd))
    }

    public setStoreData(sd: SettingsStoreData) {
        this.patchState(s => ({
            couchDbSyncEnabled: !!sd.couchDbSyncUri,
            couchDbSyncUri: sd.couchDbSyncUri,
            combatClassNames: this.stringsAdapter.setAll(sd.combatClassNames, s.combatClassNames),
            speciesNames: this.stringsAdapter.setAll(sd.speciesNames, s.speciesNames)
        }))
    }

    public readonly enableCouchDBSync: (uri: string) => void = this.effect<string>($ => $.pipe(
        mergeMap(uri => this.dbReplicationService.registerRemoteCouchDb(uri)),
        tap(uri => this.patchState({couchDbSyncUri: uri}))
    ))

    public readonly disableCouchDBSync: () => void = this.effect<void>($ => $.pipe(
        mergeMap(() => this.dbReplicationService.registerRemoteCouchDb(null)),
        tap(uri => this.patchState({couchDbSyncUri: uri}))
    ))

    public readonly setCombatClassNames: (classNames: string[]) => void = this.effect<string[]>($ => $.pipe(
        mergeMap(l => this.settings.setSetting('combatClassNames', l)),
        tap(l => this.patchState(s => ({
            combatClassNames: this.stringsAdapter.setAll(l, s.combatClassNames)
        })))
    ))

    public readonly setSpeciesNames: (speciesNames: string[]) => void = this.effect<string[]>($ => $.pipe(
        mergeMap(l => this.settings.setSetting('speciesNames', l)),
        tap(l => this.patchState(s => ({
            speciesNames: this.stringsAdapter.setAll(l, s.speciesNames)
        })))
    ))

}
