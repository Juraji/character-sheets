import {inject} from '@angular/core'
import {ResolveFn} from '@angular/router';
import {forkJoin} from 'rxjs'

import {DatabaseService} from '@core/db/database.service'
import {ForkJoinSource} from '@core/rxjs'

import {StoryOverviewStoreData} from './story-overview.store';


export const charactersOverviewResolver: ResolveFn<StoryOverviewStoreData> = () => {
    const db = inject(DatabaseService)

    const sources: ForkJoinSource<StoryOverviewStoreData> = {
        stories: db.getAllByType('STORY')
    }

    return forkJoin(sources)
}
