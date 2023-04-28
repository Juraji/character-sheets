import {Model} from './core';

export interface Character extends Model {
    modelType: 'CHARACTER'
    name: string
    age: Optional<number>
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
