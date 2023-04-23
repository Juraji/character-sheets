import {inject} from '@angular/core'
import {ResolveFn} from '@angular/router'
import {forkJoin, map} from 'rxjs'

import {DatabaseService} from '@core/db/database.service'
import {Character, SHEET_IMAGE_ATTACHMENT} from '@core/db/model'

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
            sheetImage: null,
            personality: [],
            abilities: []
        }
    } else {
        const db = inject(DatabaseService)
        const sources = {
            character: db.getById<Character>(characterId),
            sheetImage: db.getAttachment(characterId, SHEET_IMAGE_ATTACHMENT)
                .pipe(db.catchNotFound())
        }

        return forkJoin(sources)
            .pipe(map(({character, sheetImage}) => ({...character, sheetImage})))
    }
}
