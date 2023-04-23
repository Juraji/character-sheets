import {inject} from '@angular/core'
import {ResolveFn} from '@angular/router';
import {forkJoin} from 'rxjs'

import {DatabaseService} from '@core/db/database.service'
import {ForkJoinSource} from '@core/rxjs'

import {CharactersOverviewStoreData} from './characters-overview.store'


export const charactersOverviewResolver: ResolveFn<CharactersOverviewStoreData> = () => {
    const db = inject(DatabaseService)

    const sources: ForkJoinSource<CharactersOverviewStoreData> = {
        characters: db.getAllByType('CHARACTER')
    }

    return forkJoin(sources)
}
