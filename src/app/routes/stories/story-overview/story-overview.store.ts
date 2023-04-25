import {Injectable} from '@angular/core';
import {EntityState} from '@ngrx/entity';
import {map, Observable, takeUntil} from 'rxjs';

import {Story} from '@core/db/model';
import {AppComponentStore, AppEntityAdapter} from '@core/ngrx';
import {strSort} from '@core/util/sorters';

interface StoryOverviewStoreState {
    stories: EntityState<Story>
}

export interface StoryOverviewStoreData {
    stories: Story[]
}

@Injectable()
export class StoryOverviewStore extends AppComponentStore<StoryOverviewStoreState> {

    private readonly storyAdapter: AppEntityAdapter<Story> = this.createEntityAdapter(e => e._id, strSort(e => e.title))

    public readonly stories$: Observable<Story[]> = this
        .select(s => s.stories)
        .pipe(map(this.storyAdapter.selectAll))

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
