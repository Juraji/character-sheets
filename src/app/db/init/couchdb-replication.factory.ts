import PouchDB from 'pouchdb';
import {from, mergeMap, tap} from 'rxjs';

import {filterNotEmpty, filterNotNull} from '@core/rxjs';
import {SettingsService} from '@db/query';

export const couchDbReplicationFactory = (settings: SettingsService, db: PouchDB.Database) => () => {
    const syncOpts: PouchDB.Replication.SyncOptions = {
        live: true,
        retry: true,
        back_off_function: delay => delay === 0 ? 1000 : delay * 3,
        selector: {modelType: {$ne: 'SETTINGS'}}
    }

    settings.getSetting('couchDbUri')
        .pipe(
            filterNotNull(),
            filterNotEmpty(),
            tap(uri => console.log('CouchDB uri detected, setting up sync', uri)),
            mergeMap(couchDbUri => from(db.sync(couchDbUri, syncOpts)))
        )
        .subscribe(r => console.log('DB replication', r))
}
