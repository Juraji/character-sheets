import {inject} from '@angular/core'
import {ResolveFn} from '@angular/router';
import {forkJoin} from 'rxjs'

import {ForkJoinSource} from '@core/rxjs'
import {CharacterService} from '@db/query';

import {CharactersOverviewStoreData} from './characters-overview.store'


export const charactersOverviewResolver: ResolveFn<CharactersOverviewStoreData> = () => {
    const db = inject(CharacterService)

    const sources: ForkJoinSource<CharactersOverviewStoreData> = {
        characters: db.findAll()
    }

    return forkJoin(sources)
}
