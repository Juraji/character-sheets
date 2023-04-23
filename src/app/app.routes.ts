import {Routes} from '@angular/router'

export default [
    {
        path: 'characters',
        loadChildren: () => import('./routes/characters/characters.routes')
    },
    {
        path: '**',
        redirectTo: 'characters'
    }
] as Routes
