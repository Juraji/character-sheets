import {APP_INITIALIZER, InjectionToken, Provider} from '@angular/core';
import PouchDB from 'pouchdb'

import {createPouchIndexesFactory} from '@db/init/pouch-indexes.factory';
import {CharacterService, DbReplicationService, SettingsService, StoryService} from '@db/query';

import {pouchdbFactory} from './pouchdb.factory';

export const POUCH_DB = new InjectionToken<PouchDB.Database>('APP_POUCH_DB')

export function provideDb(): Provider[] {
    return [
        {provide: POUCH_DB, useFactory: pouchdbFactory},
        {provide: DbReplicationService, useClass: DbReplicationService, deps: [POUCH_DB]},
        {provide: CharacterService, useClass: CharacterService, deps: [POUCH_DB]},
        {provide: StoryService, useClass: StoryService, deps: [POUCH_DB]},
        {provide: SettingsService, useClass: SettingsService, deps: [POUCH_DB]},
        {provide: APP_INITIALIZER, useFactory: createPouchIndexesFactory, deps: [POUCH_DB], multi: true},
    ]
}

