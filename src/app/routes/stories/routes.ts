import {Routes} from '@angular/router';

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
    // {
    //     path: 'edit/:storyId',
    //     component: null,
    //     resolve: {
    //         storeData: null
    //     }
    // },
    {
        path: '**',
        redirectTo: 'overview'
    }
] as Routes
