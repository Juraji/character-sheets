import {Injectable} from '@angular/core';
import {map, Observable, switchMap, tap} from 'rxjs';

import {AppComponentStore} from '@core/ngrx';
import {filterNotNull} from '@core/rxjs';
import {DbReplicationService} from '@db/query';

interface SettingsStoreState {
    // CouchDB Synchronization
    couchDbSyncEnabled: boolean,
    couchDbSyncUri: Optional<string>,
}

@Injectable()
export class SettingsStore extends AppComponentStore<SettingsStoreState> {

    public readonly couchDbSyncEnabled$: Observable<boolean> = this.select(s => s.couchDbSyncEnabled)
    public readonly couchDbSyncUri$: Observable<Optional<string>> = this
        .select(s => s.couchDbSyncUri)
        .pipe(filterNotNull(), map(uri => {
            const uriObj = new URL(uri)
            if (!!uriObj.username) uriObj.username = '***'
            if (!!uriObj.password) uriObj.password = '***'
            return uriObj.toString()
        }))

    constructor(
        private readonly dbReplicationService: DbReplicationService
    ) {
        super();

        this.setState({
            couchDbSyncEnabled: false,
            couchDbSyncUri: null
        })

        this.initCouchDbSyncSettings()
    }

    public enableCouchDBSync(uri: string) {
        this.dbReplicationService.registerRemoteCouchDb(uri)
    }

    public disableCouchDBSync() {
        this.dbReplicationService.registerRemoteCouchDb(null)
    }

    private readonly initCouchDbSyncSettings: () => void = this.effect<void>($ => $.pipe(
        switchMap(() => this.dbReplicationService.remoteCouchDbUri$),
        tap(uri => this.patchState({
            couchDbSyncEnabled: uri !== null,
            couchDbSyncUri: uri
        }))
    ))
}
