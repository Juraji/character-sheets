import PouchDB from 'pouchdb';
import PouchDBFindPlugin from 'pouchdb-find';

const DATABASE_NAME = 'character-sheets-db'
const DB_COMPACT_INTERVAL = 6e4

export function pouchdbFactory() {
    // Create PouchDB instance
    PouchDB.plugin(PouchDBFindPlugin)
    const db: PouchDB.Database = new PouchDB(DATABASE_NAME)

    // Set up database compaction
    db.compact({interval: DB_COMPACT_INTERVAL})
        .then(() => null)

    return db
}
