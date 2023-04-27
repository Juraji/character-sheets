import {Routes} from '@angular/router';

import {SettingsComponent} from './settings.component';
import {settingsResolver} from './settings.resolver';

export default [
    {
        path: '**',
        component: SettingsComponent,
        resolve: {
            storeData: settingsResolver
        }
    }
] as Routes
