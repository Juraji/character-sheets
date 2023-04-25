import {Routes} from '@angular/router';

import {EditStoryComponent} from './edit-story/edit-story.component';
import {editStoryResolver} from './edit-story/edit-story.resolver';
import {StoryOverviewComponent} from './story-overview/story-overview.component';
import {charactersOverviewResolver} from './story-overview/story-overview.resolver';

export default [
    {
        path: 'overview',
        component: StoryOverviewComponent,
        resolve: {
            storeData: charactersOverviewResolver
        }
    },
    {
        path: 'edit/:storyId',
        component: EditStoryComponent,
        resolve: {
            storeData: editStoryResolver
        }
    },
    {
        path: '**',
        redirectTo: 'overview'
    }
] as Routes
