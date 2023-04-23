import {inject} from '@angular/core'
import {ResolveFn} from '@angular/router'
import {forkJoin} from 'rxjs'

import {DatabaseService} from '@core/db/database.service'
import {ForkJoinSource} from '@core/rxjs'

import {EditCharacterStoreData} from './edit-character.store'

export const editCharacterResolver: ResolveFn<EditCharacterStoreData> = route => {
    const characterId = route.paramMap.get('characterId')

    if (characterId === null || characterId === 'new') {
        return {
            character: {
                _id: '',
                _rev: '',
                modelType: 'CHARACTER',
                name: '',
                bio: '',
                age: 100,
                species: '',
                combatClass: '',
                personality: [],
                abilities: []
            }
        }
    } else {
        const db = inject(DatabaseService)
        const sources: ForkJoinSource<EditCharacterStoreData> = {
            character: db.getById(characterId)
        }

        return forkJoin(sources)
    }
}
