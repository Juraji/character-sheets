import PouchDB from 'pouchdb'

import PouchDBCore = PouchDB.Core;

export type ModelType = 'CHARACTER' | 'STORY'

export interface Model extends PouchDBCore.IdMeta, PouchDBCore.RevisionIdMeta {
    modelType: ModelType
}

export interface Attachment {
    name: string
    contentType: string
    content: Blob
}

// Characters
export interface Character extends Model {
    modelType: 'CHARACTER'
    name: string
    age: number
    species: string
    combatClass: string
    bio: string
    abilities: CharacterAbility[]
}

export interface CharacterAbility {
    label: string
    description: string
    hitDie: number
    baseDamage: number
    shieldBuf: number
    magicResistance: number
}

export type CharacterListView = Omit<Character, 'bio' | 'abilities'>

export const SHEET_IMAGE_ATTACHMENT_ID = 'sheetImage'

// Stories
export type StoryStatus = 'CONCEPT' | 'DRAFT' | 'DONE'

export interface Story extends Model {
    modelType: 'STORY'
    title: string,
    status: StoryStatus
    draftText: string
    plotPoints: StoryPlotPoint[]
    involvedCharacters: string[]
}

export interface StoryPlotPoint {
    order: number
    description: string
}
