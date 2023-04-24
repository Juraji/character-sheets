import {inject} from '@angular/core'
import {ResolveFn} from '@angular/router'
import {forkJoin} from 'rxjs'

import {DatabaseService} from '@core/db/database.service'
import {Character, Model, SHEET_IMAGE_ATTACHMENT_ID} from '@core/db/model'

import {EditCharacterStoreData} from './edit-character.store'

const EMPTY_CHARACTER: Nullable<Character, keyof Model> = {
    _id: null,
    _rev: null,
    modelType: 'CHARACTER',
    name: 'New Character',
    bio: '',
    age: 0,
    species: '',
    combatClass: '',
    abilities: []
}

export const editCharacterResolver: ResolveFn<EditCharacterStoreData> = route => {
    const characterId = route.paramMap.get('characterId')

    if (characterId === null || characterId === 'new') {
        return {
            character: EMPTY_CHARACTER,
            sheetImage: null,
            abilities: []
        }
    } else {
        const db = inject(DatabaseService)
        const sources = {
            character: db.getById<Character>(characterId),
            sheetImage: db.getAttachment(characterId, SHEET_IMAGE_ATTACHMENT_ID)
                .pipe(db.catchNotFound())
        }

        return forkJoin(sources)
    }
}
