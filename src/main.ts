import {bootstrapApplication} from '@angular/platform-browser'
import {provideRouter} from '@angular/router'

import {DatabaseService} from '@core/db'

import {AppComponent} from './app/app.component'
import ROOT_ROUTES from './app/app.routes'


// noinspection JSIgnoredPromiseFromCall
bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(ROOT_ROUTES),
        {provide: DatabaseService, useClass: DatabaseService},
    ]
})
