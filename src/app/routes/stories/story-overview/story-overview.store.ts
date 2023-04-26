import {Injectable} from '@angular/core';
import {EntityState} from '@ngrx/entity';
import {map, Observable, takeUntil} from 'rxjs';

import {AppComponentStore, AppEntityAdapter} from '@core/ngrx';
import {chainSort, orderedSort, strSort} from '@core/util/sorters';
import {StoryListView} from '@db/model';

interface StoryOverviewStoreState {
    stories: EntityState<StoryListView>
}

export interface StoryOverviewStoreData {
    stories: StoryListView[]
}

@Injectable()
export class StoryOverviewStore extends AppComponentStore<StoryOverviewStoreState> {

    private readonly storyAdapter: AppEntityAdapter<StoryListView> = this.createEntityAdapter(e => e._id, chainSort(
        orderedSort(e => e.status, 'CONCEPT', 'DRAFT', 'DONE'),
        strSort(e => e.title)
    ))

    public readonly stories$: Observable<StoryListView[]> = this
        .select(s => s.stories)
        .pipe(this.storyAdapter.selectAll)

    constructor() {
        super()

        this.setState({
            stories: this.storyAdapter.getInitialState()
        })

        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$), map(d => d['storeData']))
            .subscribe(sd => this.setStoreData(sd))
    }

    private setStoreData(sd: StoryOverviewStoreData) {
        this.patchState(s => ({
            stories: this.storyAdapter.setAll(sd.stories, s.stories)
        }))
    }
}
