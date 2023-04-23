import {inject} from '@angular/core'
import {ResolveFn} from '@angular/router'

import {DatabaseService} from '@core/db/database.service'
import {Character} from '@core/db/model'

import {EditCharacterStoreData} from './edit-character.store'

export const editCharacterResolver: ResolveFn<EditCharacterStoreData> = route => {
    const characterId = route.paramMap.get('characterId')

    if (characterId === null || characterId === 'new') {
        return {
            _id: null,
            _rev: null,
            modelType: 'CHARACTER',
            name: 'New Character',
            bio: '',
            age: null,
            species: '',
            combatClass: '',
            personality: [],
            abilities: []
        }
    } else {
        const db = inject(DatabaseService)
        return db.getById<Character>(characterId)
    }
}
