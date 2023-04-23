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
    personality: CharacterTrait[]
    abilities: CharacterAbility[]
}

export interface CharacterTrait {
    label: string
    description: string
}

export interface CharacterAbility extends CharacterTrait {
    hitDie: number
    baseDamage: number
    shieldBuf: number
    magicResistance: number
}

export const SHEET_IMAGE_ATTACHMENT_ID = 'sheetImage'
