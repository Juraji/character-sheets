import PouchDB from 'pouchdb'

import PouchDBCore = PouchDB.Core

export type ModelType = 'CHARACTER'

export interface Model extends PouchDBCore.IdMeta, PouchDBCore.RevisionIdMeta {
    modelType: ModelType
}

export type ModelPropertiesOf<T extends Model> = Omit<T, '_id' | '_rev' | 'modelType'>
export type ModelFormOf<T extends Model, M = ModelPropertiesOf<T>> = {
    [P in keyof M]: M[P] | null;
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
    damage: number
    shieldBuf: number
    magicResistance: number
}
