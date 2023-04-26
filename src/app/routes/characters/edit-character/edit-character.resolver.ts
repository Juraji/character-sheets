import {inject} from '@angular/core'
import {ResolveFn} from '@angular/router'
import {TranslateService} from '@ngx-translate/core';
import {forkJoin} from 'rxjs'

import {ForkJoinSource} from '@core/rxjs';
import {Character, Model} from '@db/model';
import {CharacterService} from '@db/query';


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
        const name = inject(TranslateService).instant('edit.form.characters.name.default')

        return {
            character: {...EMPTY_CHARACTER, name},
            sheetImage: null,
            abilities: []
        }
    } else {
        const db = inject(CharacterService)
        const sources: ForkJoinSource<EditCharacterStoreData> = {
            character: db.findById(characterId),
            sheetImage: db.findSheetImage(characterId)
        }

        return forkJoin(sources)
    }
}
