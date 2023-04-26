import {inject} from '@angular/core';
import {ResolveFn} from '@angular/router';
import {forkJoin, map} from 'rxjs';

import {DatabaseService} from '@core/db/database.service';
import {CharacterListView, Model, Story} from '@core/db/model';
import {ForkJoinSource} from '@core/rxjs';
import {isNotNullable} from '@core/util/objects';

import {EditStoryStoreData} from './edit-story.store';

const EMPTY_STORY: Nullable<Story, keyof Model> = {
    _id: null,
    _rev: null,
    modelType: 'STORY',
    title: '',
    status: 'CONCEPT',
    draftText: '',
    plotPoints: [],
    involvedCharacters: []
}

export const editStoryResolver: ResolveFn<EditStoryStoreData> = route => {
    const db = inject(DatabaseService)
    const storyId = route.paramMap.get('storyId')

    if (storyId === 'new' || storyId == null) {
        return {
            story: EMPTY_STORY,
            involvedCharacters: [],
            attachments: [],
            availableCharacters: []
        }
    } else {
        return forkJoin<ForkJoinSource<EditStoryStoreData>>({
            story: db.getById<Story>(storyId),
            availableCharacters: db
                .getAllByType<CharacterListView>('CHARACTER', ['name', 'age', 'species', 'combatClass']),
            involvedCharacters: [[]],
            attachments: db.getAllAttachments(storyId),
        }).pipe(map(res => ({
                ...res,
                involvedCharacters: res.story.involvedCharacters
                    .map(cId => res.availableCharacters.find(c => c._id === cId) as CharacterListView)
                    .filter(isNotNullable)
            })
        ))
    }
}
