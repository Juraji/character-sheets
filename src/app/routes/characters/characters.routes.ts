import {Routes} from '@angular/router'

import {CharactersOverviewComponent} from './characters-overview/characters-overview.component'
import {charactersOverviewResolver} from './characters-overview/characters-overview.resolver'
import {EditCharacterComponent} from './edit-character/edit-character.component'
import {editCharacterResolver} from './edit-character/edit-character.resolver'

export default [
    {
        path: 'overview',
        component: CharactersOverviewComponent,
        resolve: {
            storeData: charactersOverviewResolver
        }
    },
    {
        path: 'edit/:characterId',
        component: EditCharacterComponent,
        resolve: {
            storeData: editCharacterResolver
        }
    },
    {
        path: '**',
        redirectTo: 'overview'
    }
] as Routes
