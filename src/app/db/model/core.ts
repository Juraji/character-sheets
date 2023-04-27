export type ModelId = PouchDB.Core.IdMeta & PouchDB.Core.RevisionIdMeta
export type ModelType = 'CHARACTER' | 'STORY' | 'SETTINGS'

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

export type ReplicationStatus = 'PAUSED' | 'ACTIVE' | 'DENIED' | 'ERROR' | 'COMPLETE'

export interface ReplicationStatusMessage {
    status: ReplicationStatus
    reason?: string,
}
