import {inject} from '@angular/core';
import PouchDB from 'pouchdb'
import {catchError, defer, map, mergeMap, Observable, OperatorFunction, pipe, throwError, UnaryFunction} from 'rxjs'
import {v4 as uuidV4} from 'uuid'

import {AppException} from '@core/exceptions'
import {POUCH_DB} from '@db/init';
import {Attachment, Model, ModelId, ModelType, SaveAttachmentResponse} from '@db/model'

/**
 * @param T Model interface
 * @param L Model list view interface
 */
export abstract class DatabaseService<T extends Model, L extends Partial<Omit<T, keyof Model>> & Model> {
    protected readonly pouchDb: PouchDB.Database
    protected readonly lvFields: string[] | undefined

    /**
     *
     * @param modelType
     * @param listViewFields
     * @protected
     */
    protected constructor(
        protected readonly modelType: ModelType,
        listViewFields?: string[]
    ) {
        this.pouchDb = inject(POUCH_DB)
        this.lvFields = !!listViewFields ? [...listViewFields, 'modelType', '_id', '_rev'] : undefined
    }

    public findById(documentId: string): Observable<T> {
        return defer(() => this.pouchDb.get<T>(documentId))
    }

    public findAll(): Observable<L[]> {
        const findRequest: PouchDB.Find.FindRequest<L> = {
            selector: {modelType: this.modelType},
            fields: this.lvFields
        }

        // noinspection JSVoidFunctionReturnValueUsed
        return defer(() => this.pouchDb.find(findRequest) as Promise<PouchDB.Find.FindResponse<L>>)
            .pipe(map(res => res.docs))
    }

    public save(doc: Omit<Nullable<T, keyof Model>, 'modelType'>): Observable<T> {
        const updateCandidate: T = (!doc._id
            ? {...doc, _id: uuidV4(), _rev: undefined, modelType: this.modelType}
            : {...doc, modelType: this.modelType}) as T

        return defer(() => this.pouchDb.put(updateCandidate))
            .pipe(
                this.handlePouchDbResponse(),
                map(r => ({...doc, _id: r.id, _rev: r.rev}) as T)
            )
    }

    public delete(docId: string, docRev: string): Observable<void> {
        return defer(() => this.pouchDb.remove({_id: docId, _rev: docRev}))
            .pipe(this.handlePouchDbResponse(), map(() => undefined))
    }

    public findAttachment(docId: string, name: string): Observable<Attachment> {
        return defer(() => this.pouchDb.getAttachment(docId, name) as Promise<Blob>)
            .pipe(map(content => ({name, content, contentType: content.type})))
    }

    public findAllAttachments(docId: string): Observable<Attachment[]> {
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

    public saveAttachment(
        docId: string,
        docRev: string,
        name: string,
        content: Blob
    ): Observable<SaveAttachmentResponse> {
        return defer(() => this.pouchDb.putAttachment(docId, name, docRev, content, content.type)).pipe(
            this.handlePouchDbResponse(),
            map(r => ({
                _id: r.id, _rev: r.rev,
                attachment: {name, content, contentType: content.type}
            }))
        )
    }

    public deleteAttachment(docId: string, docRev: string, name: string): Observable<ModelId> {
        return defer(() => this.pouchDb.removeAttachment(docId, name, docRev)).pipe(
            this.handlePouchDbResponse(),
            map(r => ({_id: r.id, _rev: r.rev}))
        )
    }

    public readonly catchNotFound: <R>(defaultValue?: Optional<R>) => OperatorFunction<R, Optional<R>> = (defaultValue) => pipe(
        catchError(e => e.name === 'not_found' ? [defaultValue] : throwError(e))
    )

    private readonly handlePouchDbResponse: () => UnaryFunction<Observable<PouchDB.Core.Response>, Observable<PouchDB.Core.Response>> = () => pipe(
        catchError(e => [{ok: false, id: e.message, rev: ''} as PouchDB.Core.Response]),
        mergeMap(r => !!r.ok
            ? [r]
            : throwError(() => new AppException('DatabaseService', r.id))
        )
    )
}
