import {Injectable, OnDestroy} from '@angular/core';
import PouchDB from 'pouchdb'
import PouchDBFindPlugin from 'pouchdb-find'
import {
    catchError,
    defer,
    filter,
    from,
    fromEvent,
    map,
    mergeMap,
    Observable,
    pipe,
    throwError,
    UnaryFunction
} from 'rxjs'
import {v4 as uuidV4} from 'uuid'

import {Attachment, Model, ModelType} from '@core/db/model'
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

        this.pouchDb.compact({
            interval: DB_COMPACT_INTERVAL
        })

        fromEvent(window, 'beforeunload')
            .pipe(takeUntilDestroyed(this))
            .subscribe(() => this.pouchDb.close())

        this.registerIndex<Model>('idx_model_model_type', ['modelType']).subscribe()
    }

    public ngOnDestroy() {
    }

    public getById<T extends Model>(documentId: string): Observable<T> {
        return defer(() => this.pouchDb.get<T>(documentId))
    }

    public getAllByType<T extends Model>(modelType: ModelType, fields?: string[]): Observable<T[]> {
        const findRequest: PouchDB.Find.FindRequest<T> = {selector: {modelType}, fields}
        // noinspection JSVoidFunctionReturnValueUsed
        return defer(() => this.pouchDb.find(findRequest) as Promise<PouchDB.Find.FindResponse<T>>)
            .pipe(map(res => res.docs))
    }

    public save<T extends Model>(doc: Nullable<T, '_id' | '_rev'>): Observable<T> {
        const updateCandidate: T = (!doc._id
            ? {...doc, _id: uuidV4(), _rev: undefined}
            : doc) as T

        return defer(() => this.pouchDb.put(updateCandidate))
            .pipe(map(r => ({...doc, _id: r.id, _rev: r.rev}) as T))
    }

    public delete(docId: string, docRev: string): Observable<boolean> {
        return defer(() => this.pouchDb.remove({_id: docId, _rev: docRev}))
            .pipe(map(r => !!r?.ok))
    }

    public getAttachment(docId: string, name: string): Observable<Attachment> {
        return defer(() => this.pouchDb.getAttachment(docId, name) as Promise<Blob>)
            .pipe(map(content => ({name, content, contentType: content.type})))
    }

    public getAllAttachments(docId: string): Observable<Attachment[]> {
        return defer(() => this.pouchDb.get(docId, {attachments: true, binary: true}))
            .pipe(
                map(it => (it._attachments || {}) as Record<string, PouchDB.Core.FullAttachment>),
                map(attMap => Object
                    .entries(attMap)
                    .map(([name, att]) => ({
                        name,
                        contentType: att.content_type,
                        content: att.data as Blob
                    })))
            )
    }

    public putAttachment(
        docId: string,
        docRev: string,
        name: string,
        contentType: string,
        content: Blob
    ): Observable<Omit<Model, 'modelType'> & { attachment: Attachment }> {
        return defer(() => this.pouchDb.putAttachment(docId, name, docRev, content, contentType)).pipe(
            this.handlePouchDbResponse(),
            map(r => ({
                _id: r.id, _rev: r.rev,
                attachment: {name, content, contentType: content.type}
            }))
        )
    }

    public removeAttachment(docId: string, docRev: string, name: string): Observable<Omit<Model, 'modelType'>> {
        return defer(() => this.pouchDb.removeAttachment(docId, name, docRev)).pipe(
            this.handlePouchDbResponse(),
            map(r => ({_id: r.id, _rev: r.rev}))
        )
    }

    public registerIndex<T extends Model, K = keyof T>(
        name: string,
        fields: K[],
        documentSelector?: PouchDB.Find.Selector
    ) {
        // noinspection JSVoidFunctionReturnValueUsed
        return defer(() => this.pouchDb.getIndexes())
            .pipe(
                filter(res => !res.indexes.some(idx => idx.name === name)),
                mergeMap(() => from(this.pouchDb.createIndex({
                    index: {
                        name,
                        fields: fields as string[],
                        partial_filter_selector: documentSelector,
                    }
                })))
            )
    }

    public readonly catchNotFound = <T>(defaultValue: Optional<T> = null) => pipe<Observable<T>, Observable<Optional<T>>>(
        catchError(e => e.name === 'not_found' ? [defaultValue] : throwError(e))
    )

    private readonly handlePouchDbResponse: () => UnaryFunction<Observable<PouchDB.Core.Response>, Observable<PouchDB.Core.Response>> = () => pipe(
        catchError(e => [{ok: false, id: e.message, rev: ''} as PouchDB.Core.Response]),
        mergeMap(r => !!r.ok ? [r] : throwError(() => new AppException(DatabaseService, r.id)))
    )
}
