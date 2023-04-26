import {InjectionToken, Provider} from '@angular/core';
import PouchDB from 'pouchdb'
import PouchDBFindPlugin from 'pouchdb-find'
import {defer, first, from, fromEvent, map, mergeMap, withLatestFrom} from 'rxjs';

import {CharacterService, StoryService} from '@db/query';

export const POUCH_DB = new InjectionToken<PouchDB.Database>('PouchDB')

const DATABASE_NAME = 'character-sheets-db'
const DB_COMPACT_INTERVAL = 6e4

const INDEXES: PouchDB.Find.CreateIndexOptions[] = [
    {index: {name: 'idx_model_model_type', fields: ['modelType'],}}
]

export function pouchdbFactory() {
    // Create PouchDB instance
    PouchDB.plugin(PouchDBFindPlugin)
    const db: PouchDB.Database = new PouchDB(DATABASE_NAME)

    // Set up database compaction
    db.compact({interval: DB_COMPACT_INTERVAL})
        .then(() => null)

    // On browser close, close DB session
    fromEvent(window, 'beforeunload')
        .pipe(first())
        .subscribe(() => db.close())

    // Set up indexes
    // noinspection JSVoidFunctionReturnValueUsed
    defer(() => db.getIndexes())
        .pipe(
            map(res => res.indexes.map(idx => idx.name)),
            withLatestFrom([INDEXES]),
            mergeMap(([existingIdxNames, toCreate]) => toCreate
                .filter(cio => !!cio.index.name && !existingIdxNames.includes(cio.index.name))),
            mergeMap(cio => from(db.createIndex(cio)))
        )
        .subscribe(res =>
            console.info('Created index', res.result))


    return db
}

export function provideDb(): Provider[] {
    return [
        {provide: POUCH_DB, useFactory: pouchdbFactory},
        {provide: CharacterService, useClass: CharacterService, deps: [POUCH_DB]},
        {provide: StoryService, useClass: StoryService, deps: [POUCH_DB]},
    ]
}
