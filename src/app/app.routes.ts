import {Routes} from '@angular/router'

export default [
    {
        path: 'characters',
        loadChildren: () => import('./routes/characters/routes')
    },
    {
        path: 'stories',
        loadChildren: () => import('./routes/stories/routes')
    },
    {
        path: '**',
        redirectTo: 'characters'
    }
] as Routes
