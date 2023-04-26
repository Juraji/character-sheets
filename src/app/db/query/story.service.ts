import {Injectable} from '@angular/core';

import {Story, StoryListView} from '@db/model';

import {DatabaseService} from './database-service';

@Injectable()
export class StoryService extends DatabaseService<Story, StoryListView> {

    constructor() {
        super('STORY', ['title', 'status']);
    }
}
