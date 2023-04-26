import {inject} from '@angular/core'
import {ResolveFn} from '@angular/router';
import {forkJoin} from 'rxjs'

import {ForkJoinSource} from '@core/rxjs'
import {StoryService} from '@db/query';

import {StoryOverviewStoreData} from './story-overview.store';


export const charactersOverviewResolver: ResolveFn<StoryOverviewStoreData> = () => {
    const db = inject(StoryService)

    const sources: ForkJoinSource<StoryOverviewStoreData> = {
        stories: db.findAll()
    }

    return forkJoin(sources)
}
