import {Injectable, OnDestroy} from '@angular/core';
import PouchDB from 'pouchdb'
import PouchDBFindPlugin from 'pouchdb-find'
import {catchError, from, interval, map, mergeMap, Observable, pipe, throwError, UnaryFunction} from 'rxjs'
import {v4 as uuidV4} from 'uuid'

import {Model, ModelType} from '@core/db/model'
import {AppException} from '@core/exceptions'
import {takeUntilDestroyed} from '@core/rxjs'

const DATABASE_NAME = 'character-sheets-db'
const DB_COMPACT_INTERVAL = 6e4

@Injectable()
export class DatabaseService implements OnDestroy {
    private pouchDb: PouchDB.Database

    constructor() {
        PouchDB.plugin(PouchDBFindPlugin)
        this.pouchDb = new PouchDB(DATABASE_NAME);

        interval(DB_COMPACT_INTERVAL)
            .pipe(takeUntilDestroyed(this))
            .subscribe(() => {
                this.pouchDb.compact()
                this.pouchDb.viewCleanup()
            })
    }

    public ngOnDestroy() {
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
        const updateCandidate: T = !doc._id || doc._id === ''
            ? {...doc, _id: uuidV4(), _rev: undefined}
            : doc

        return from(this.pouchDb.put(updateCandidate))
            .pipe(map(r => ({...doc, _id: r.id, _rev: r.rev})))
    }

    public delete<T extends Model>(doc: T): Observable<boolean> {
        return from(this.pouchDb.remove(doc))
            .pipe(map(r => !!r?.ok))
    }

    public getAttachment(docId: string, name: string): Observable<Nullable<Blob>> {
        return from(this.pouchDb.getAttachment(docId, name) as Promise<Blob>)
    }

    public putAttachment(
        docId: string,
        docRev: string,
        name: string,
        contentType: string,
        content: Blob
    ): Observable<Omit<Model, 'modelType'> & { content: Blob }> {
        return from(this.pouchDb.putAttachment(docId, name, docRev, content, contentType)).pipe(
            this.handlePouchDbResponse(),
            map(r => ({_id: r.id, _rev: r.rev, content}))
        )
    }

    public removeAttachment(docId: string, docRev: string, name: string): Observable<Omit<Model, 'modelType'>> {
        return from(this.pouchDb.removeAttachment(docId, name, docRev)).pipe(
            this.handlePouchDbResponse(),
            map(r => ({_id: r.id, _rev: r.rev}))
        )
    }

    public readonly catchNotFound = <T>(defaultValue: Nullable<T> = null) => pipe<Observable<T>, Observable<Nullable<T>>>(
        catchError(e => e.name === 'not_found' ? [defaultValue] : throwError(e))
    )

    private readonly handlePouchDbResponse: () => UnaryFunction<Observable<PouchDB.Core.Response>, Observable<PouchDB.Core.Response>> = () => pipe(
        catchError(e => [{ok: false, id: e.message, rev: ''} as PouchDB.Core.Response]),
        mergeMap(r => !!r.ok ? [r] : throwError(() => new AppException(DatabaseService, r.id)))
    )
}
