import {Injectable} from '@angular/core';
import PouchDB from 'pouchdb'
import PouchDBFindPlugin from 'pouchdb-find'
import {filter, from, map, Observable, throwIfEmpty} from 'rxjs'
import {v4 as uuidV4} from 'uuid'

import {Model, ModelType} from '@core/db/model'
import {AppException} from '@core/exceptions'
import {filterNotNull} from '@core/rxjs/filters'

const DATABASE_NAME = 'character-sheets-db'

@Injectable()
export class DatabaseService {
    private pouchDb: PouchDB.Database

    constructor() {
        PouchDB.plugin(PouchDBFindPlugin)
        this.pouchDb = new PouchDB(DATABASE_NAME);
    }


    public getById<T extends Model>(documentId: string): Observable<T> {
        return from(this.pouchDb.get<T>(documentId))
    }

    public getAllByType<T extends Model>(modelType: ModelType): Observable<T[]> {
        const findRequest: PouchDB.Find.FindRequest<T> = {selector: {modelType}}
        // noinspection JSVoidFunctionReturnValueUsed
        return from(this.pouchDb.find(findRequest) as Promise<PouchDB.Find.FindResponse<T>>)
            .pipe(map(res => res.docs))
    }

    public save<T extends Model>(doc: T): Observable<T> {
        const updateCandidate: T = doc._id === ''
            ? {...doc, _id: uuidV4(), _rev: undefined}
            : doc

        return from(this.pouchDb.put(updateCandidate))
            .pipe(
                filterNotNull(),
                filter(r => r.ok),
                map(r => ({...doc, _id: r.id, _rev: r.rev})),
                throwIfEmpty(() => new AppException('DatabaseService', `Persist failed for object ${doc.modelType}[id=${doc._id}]`))
            )
    }

    public delete<T extends Model>(doc: T): Observable<boolean> {
        return from(this.pouchDb.remove(doc))
            .pipe(map(r => r.ok))
    }
}
