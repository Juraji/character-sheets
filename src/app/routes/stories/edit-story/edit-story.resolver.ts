import {inject} from '@angular/core';
import {ResolveFn} from '@angular/router';
import {forkJoin, map, mergeMap} from 'rxjs';

import {ForkJoinSource} from '@core/rxjs';
import {isNotNullable} from '@core/util/objects';
import {CharacterListView, Model, Story} from '@db/model';
import {CharacterService, StoryService} from '@db/query';

import {EditStoryStoreData} from './edit-story.store';


const EMPTY_STORY: Nullable<Story, keyof Model> = {
    _id: null,
    _rev: null,
    modelType: 'STORY',
    title: '',
    status: 'DRAFT',
    draftText: '',
    plotPoints: [],
    involvedCharacters: []
}

export const editStoryResolver: ResolveFn<EditStoryStoreData> = route => {
    const storyService = inject(StoryService)
    const characterService = inject(CharacterService)
    const storyId = route.paramMap.get('storyId')

    if (storyId === 'new' || storyId == null) {
        return {
            story: EMPTY_STORY,
            involvedCharacters: [],
            attachments: [],
            availableCharacters: [] // Should load, but not needed on create
        }
    } else {
        return characterService
            .findAll()
            .pipe(
                mergeMap(availableCharacters => forkJoin<ForkJoinSource<EditStoryStoreData>>({
                    story: storyService.findById(storyId),
                    availableCharacters: [availableCharacters],
                    involvedCharacters: [[]],
                    attachments: storyService.findAllAttachments(storyId)
                })),
                map(res => ({
                    ...res,
                    involvedCharacters: res.story.involvedCharacters
                        .map(cId => res.availableCharacters.find(c => c._id === cId))
                        .filter(isNotNullable) as CharacterListView[]
                }))
            )
    }
}
