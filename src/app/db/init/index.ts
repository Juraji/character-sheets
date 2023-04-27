import {APP_INITIALIZER, InjectionToken, Provider} from '@angular/core';
import PouchDB from 'pouchdb'

import {couchDbReplicationFactory} from '@db/init/couchdb-replication.factory';
import {createPouchIndexesFactory} from '@db/init/pouch-indexes.factory';
import {pouchdbFactory} from '@db/init/pouchdb.factory';
import {CharacterService, SettingsService, StoryService} from '@db/query';

export const POUCH_DB = new InjectionToken<PouchDB.Database>('PouchDB')

export function provideDb(): Provider[] {
    return [
        {provide: POUCH_DB, useFactory: pouchdbFactory},
        {provide: APP_INITIALIZER, useFactory: createPouchIndexesFactory, deps: [POUCH_DB], multi: true},
        {provide: CharacterService, useClass: CharacterService, deps: [POUCH_DB]},
        {provide: StoryService, useClass: StoryService, deps: [POUCH_DB]},
        {provide: SettingsService, useClass: SettingsService, deps: [POUCH_DB]},
        {
            provide: APP_INITIALIZER,
            useFactory: couchDbReplicationFactory,
            deps: [SettingsService, POUCH_DB],
            multi: true
        },
    ]
}

