import PouchDB from 'pouchdb'

import PouchDBCore = PouchDB.Core;

export type ModelType = 'CHARACTER' | 'STORY'

export interface Model extends PouchDBCore.IdMeta, PouchDBCore.RevisionIdMeta {
    modelType: ModelType
}

// Characters
export interface Character extends Model {
    modelType: 'CHARACTER'
    name: string
    bio: string
    age: number
    species: string
    combatClass: string
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

export const SHEET_IMAGE_ATTACHMENT_ID = 'sheetImage'

// Stories
type StoryStatus = 'CONCEPT' | 'DRAFT' | 'DONE'

export interface Story extends Model {
    modelType: 'STORY'
    title: string,
    status: StoryStatus
    plotPoints: StoryPlotPoint[]
    involvedCharacters: string[]
}

export interface StoryPlotPoint {
    order: number
    description: string
}
