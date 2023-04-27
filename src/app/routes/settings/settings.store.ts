import {Injectable} from '@angular/core';
import {Observable, switchMap, tap} from 'rxjs';

import {AppComponentStore} from '@core/ngrx';
import {DbReplicationService} from '@db/query';

interface SettingsStoreState {
    // CouchDB Synchronization
    couchDbSyncEnabled: boolean,
    couchDbSyncUri: Optional<string>,
}

@Injectable()
export class SettingsStore extends AppComponentStore<SettingsStoreState> {

    public readonly couchDbSyncEnabled$: Observable<boolean> = this.select(s => s.couchDbSyncEnabled)
    public readonly couchDbSyncUri$: Observable<Optional<string>> = this.select(s => s.couchDbSyncUri)

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
