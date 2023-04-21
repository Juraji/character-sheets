import {Injectable} from '@angular/core';
import * as PouchDB from 'pouchdb'
import {filter, from, map, Observable, throwIfEmpty} from 'rxjs'

import {Model} from '@core/db/model'
import {AppException} from '@core/exceptions'
import {filterNotNull} from '@core/rxjs/filters'

const DATABASE_NAME = 'character-sheets-db'

@Injectable()
export class DatabaseService {
    private pouchDb?: PouchDB.Database;

    private get db(): PouchDB.Database {
        if (!!this.pouchDb) return this.pouchDb
        else throw new AppException('DatabaseService', 'Database queried before it was initialized')
    }

    public connect(): boolean {
        this.pouchDb = new PouchDB(DATABASE_NAME)
        return true
    }

    public getById<T extends Model>(documentId: string): Observable<T> {
        return from(this.db.get(documentId)) as Observable<T>
    }

    public save<T extends Model>(doc: T): Observable<T> {
        return from(this.db.put(doc))
            .pipe(
                filterNotNull(),
                filter(r => r.ok),
                map(r => ({...doc, _id: r.id, _rev: r.rev})),
                throwIfEmpty(() => new AppException('DatabaseService', 'Persist failed for object'))
            )
    }

    public delete<T extends Model>(doc: T): Observable<boolean> {
        return from(this.db.remove(doc))
            .pipe(map(r => r.ok))
    }
}
