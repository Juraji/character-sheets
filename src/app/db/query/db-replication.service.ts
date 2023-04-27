import {Inject, Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, fromEvent, map, merge, Observable, startWith, switchMap} from 'rxjs';

import {filterNotNull, takeUntilDestroyed} from '@core/rxjs';
import {POUCH_DB} from '@db/init';
import {ReplicationStatusMessage} from '@db/model';

const COUCH_DB_URI_KEY = 'character-sheets:couch-db-uri'

@Injectable()
export class DbReplicationService implements OnDestroy {
    private readonly _remoteCouchDbUri$ = new BehaviorSubject<string | null>(localStorage.getItem(COUCH_DB_URI_KEY))
    private readonly currentSync$ = new BehaviorSubject<PouchDB.Replication.Sync<object> | null>(null)

    public readonly remoteCouchDbUri$: Observable<string | null> = this._remoteCouchDbUri$

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

    constructor(@Inject(POUCH_DB) private readonly db: PouchDB.Database) {
        this.remoteCouchDbUri$
            .pipe(takeUntilDestroyed(this))
            .subscribe(uri => this.setupReplication(uri))
    }

    public ngOnDestroy() {
    }

    public registerRemoteCouchDb(uri: string | null) {
        if (uri === null) localStorage.removeItem(COUCH_DB_URI_KEY)
        else localStorage.setItem(COUCH_DB_URI_KEY, uri)
        this._remoteCouchDbUri$.next(uri)
    }

    private setupReplication(couchDbUri: string | null) {
        // Cancel optional previous sync
        this.currentSync$.value?.cancel()

        // Create new sync if uri is defined
        if (!!couchDbUri) {
            const syncOpts: PouchDB.Replication.SyncOptions = {
                live: true,
                retry: true,
                back_off_function: delay => delay === 0 ? 1000 : delay * 3,
            }

            const sync: PouchDB.Replication.Sync<object> = this.db.sync(couchDbUri, syncOpts)
            this.currentSync$.next(sync)
        }
    }
}
