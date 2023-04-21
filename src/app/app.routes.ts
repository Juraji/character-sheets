import {Routes} from '@angular/router'

export default [
    {
        path: 'home',
        loadChildren: () => import('./home/home.routes')
    },
    {
        path: '**',
        redirectTo: 'home'
    }
] as Routes
