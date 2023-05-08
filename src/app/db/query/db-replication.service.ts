import {Inject, Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, fromEvent, map, merge, Observable, startWith, switchMap} from 'rxjs';

import {CentralCouchDBCredentials, CentralService} from '@core/central';
import {filterNotNull, takeUntilDestroyed} from '@core/rxjs';
import {POUCH_DB} from '@db/init';
import {ModelId, ReplicationStatusMessage} from '@db/model';

@Injectable()
export class DbReplicationService implements OnDestroy {
    private readonly currentSync$ = new BehaviorSubject<PouchDB.Replication.Sync<object> | null>(null)

    public readonly status$: Observable<ReplicationStatusMessage> = this.currentSync$.pipe(
        filterNotNull(),
        switchMap(sync => merge(
            fromEvent<string>(sync, 'paused').pipe(
                startWith('Replication initialized'),
                map((e): ReplicationStatusMessage => ({status: 'PAUSED', reason: e}))
            ),
            fromEvent<void>(sync, 'active').pipe(
                map((): ReplicationStatusMessage => ({status: 'ACTIVE', reason: 'Sync active'}))),
            fromEvent<string>(sync, 'denied').pipe(
                map((e): ReplicationStatusMessage => ({status: 'DENIED', reason: e}))
            ),
            fromEvent<string>(sync, 'error').pipe(
                map((e): ReplicationStatusMessage => ({status: 'ERROR', reason: e}))
            ),
            fromEvent<string>(sync, 'complete').pipe(
                map((e): ReplicationStatusMessage => ({status: 'COMPLETE', reason: e}))
            ),
        )),
    )

    constructor(
        @Inject(POUCH_DB) private readonly db: PouchDB.Database,
        private readonly centralService: CentralService,
    ) {
        this.centralService.couchDBCredentials$
            .pipe(takeUntilDestroyed(this))
            .subscribe(cred => this.setupReplication(cred))
    }

    public ngOnDestroy() {
    }

    private setupReplication(credentials: CentralCouchDBCredentials | null) {
        // Cancel optional previous sync
        this.currentSync$.value?.cancel()

        // Create new sync if uri is defined
        if (!!credentials) {
            const uri = `http://${credentials.username}:${credentials.password}@localhost:5984/${credentials.databaseName}`
            const syncOpts: PouchDB.Replication.SyncOptions = {
                live: true,
                retry: true,
                back_off_function: delay => delay === 0 ? 1000 : delay * 3,
                // Ignore design documents both ways
                filter: (doc: ModelId) => !doc._id.startsWith('_design')
            }

            const sync: PouchDB.Replication.Sync<object> = this.db.sync(uri, syncOpts)
            this.currentSync$.next(sync)
        }
    }
}
