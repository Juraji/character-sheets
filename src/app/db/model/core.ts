import PouchDB from 'pouchdb'

import PouchDBCore = PouchDB.Core;

export type ModelType = 'CHARACTER' | 'STORY' | 'SETTINGS'

export type ModelId = PouchDBCore.IdMeta & PouchDBCore.RevisionIdMeta

export interface Model extends ModelId {
    modelType: ModelType
}

export interface Attachment {
    name: string
    contentType: string
    content: Blob
}

export interface SaveAttachmentResponse extends ModelId {
    attachment: Attachment
}
