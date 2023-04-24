import PouchDB from 'pouchdb'

import PouchDBCore = PouchDB.Core

export type ModelType = 'CHARACTER'

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
