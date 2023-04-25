import {Injectable} from '@angular/core';
import {EntityState} from '@ngrx/entity';
import {map, mergeMap, Observable, takeUntil, tap, withLatestFrom} from 'rxjs';

import {Attachment, CharacterListView, Model, Story, StoryPlotPoint} from '@core/db/model';
import {AppComponentStore, AppEntityAdapter} from '@core/ngrx';
import {filterNotNull, firstNotNull} from '@core/rxjs';
import {objectOmit} from '@core/util/objects';
import {strSort} from '@core/util/sorters';

export type StoreStory = Omit<Story, keyof Model | 'plotPoints' | 'involvedCharacters'>

interface EditStoryStoreState {
    id: Optional<string>,
    rev: Optional<string>,
    story: Optional<StoreStory>
    plotPoints: EntityState<StoryPlotPoint>,
    involvedCharacters: EntityState<CharacterListView>
    attachments: EntityState<Attachment>
    availableCharacters: EntityState<CharacterListView>
}

export interface EditStoryStoreData {
    story: Nullable<Story, keyof Model>
    involvedCharacters: CharacterListView[]
    availableCharacters: CharacterListView[]
    attachments: Attachment[]
}

@Injectable()
export class EditStoryStore extends AppComponentStore<EditStoryStoreState> {
    private readonly plotPointAdapter: AppEntityAdapter<StoryPlotPoint, number> = this.createEntityAdapter<StoryPlotPoint, number>(e => e.order)
    private readonly characterAdapter: AppEntityAdapter<CharacterListView> = this.createEntityAdapter<CharacterListView>(e => e._id, strSort(e => e.name))
    private readonly attachmentAdapter: AppEntityAdapter<Attachment> = this.createEntityAdapter<Attachment>(e => e.name)

    public readonly storyId$: Observable<Optional<string>> = this.select(s => s.id)
    public readonly storyRev$: Observable<Optional<string>> = this.select(s => s.rev)
    public readonly storyIsNew$: Observable<boolean> = this.storyId$.pipe(map(id => !id))

    public readonly story$: Observable<StoreStory> = this
        .select(s => s.story)
        .pipe(filterNotNull());
    public readonly title$: Observable<string> = this.story$
        .pipe(map(it => it.title))

    public readonly plotPoints$: Observable<StoryPlotPoint[]> = this
        .select(s => s.plotPoints)
        .pipe(this.plotPointAdapter.selectAll)

    public readonly involvedCharacterIds$: Observable<string[]> = this
        .select(s => s.involvedCharacters)
        .pipe(this.characterAdapter.selectIds)

    constructor() {
        super();

        this.setState({
            id: null,
            rev: null,
            story: null,
            plotPoints: this.plotPointAdapter.getInitialState(),
            attachments: this.attachmentAdapter.getInitialState(),
            involvedCharacters: this.characterAdapter.getInitialState(),
            availableCharacters: this.characterAdapter.getInitialState()
        })

        this.activatedRoute.data
            .pipe(takeUntil(this.destroy$), map(d => d['storeData']))
            .subscribe(sd => this.setStoreData(sd))
    }

    public save(patch: StoreStory) {
        return this.storyId$.pipe(
            withLatestFrom(
                this.storyRev$,
                this.plotPoints$,
                this.involvedCharacterIds$
            ),
            mergeMap(([_id, _rev, plotPoints, involvedCharacters]) => this.db
                .save<Story>({...patch, _id, _rev, modelType: 'STORY', plotPoints, involvedCharacters})),
            tap(story => this.patchState({
                id: story._id,
                rev: story._rev,
                story: objectOmit(story, '_id', '_rev', 'plotPoints', 'involvedCharacters'),
            }))
        )
    }

    public delete() {
        return this.storyId$.pipe(
            firstNotNull(),
            withLatestFrom(this.storyRev$.pipe(filterNotNull())),
            mergeMap(([id, rev]) => this.db.delete(id, rev)),
            tap(() => this.patchState({id: null, rev: null}))
        )
    }

    private setStoreData(sd: EditStoryStoreData) {
        this.patchState(s => ({
            id: sd.story._id,
            rev: sd.story._rev,
            story: objectOmit(sd.story, '_id', '_rev', 'plotPoints', 'involvedCharacters'),
            plotPoints: this.plotPointAdapter.setAll(sd.story.plotPoints, s.plotPoints),
            involvedCharacters: this.characterAdapter.setAll(sd.involvedCharacters, s.involvedCharacters),
            attachments: this.attachmentAdapter.setAll(sd.attachments, s.attachments)
        }))
    }
}
