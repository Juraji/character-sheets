import PouchDB from 'pouchdb';
import {defer, from, map, mergeMap} from 'rxjs';

const INDEXES: PouchDB.Find.CreateIndexOptions[] = [
    {index: {name: 'idx_model_model_type', fields: ['modelType']}}
]

export const createPouchIndexesFactory = (db: PouchDB.Database) => () => {
    // noinspection JSVoidFunctionReturnValueUsed
    defer(() => db.getIndexes())
        .pipe(
            map(res => res.indexes.map(idx => idx.name)),
            mergeMap((existingIdxNames) => INDEXES
                .filter(cio => !!cio.index.name && !existingIdxNames.includes(cio.index.name))),
            mergeMap(cio => from(db.createIndex(cio)))
        )
        .subscribe(res => console.info('Created index', res.result))
}
