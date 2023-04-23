import {bootstrapApplication} from '@angular/platform-browser'
import {provideAnimations} from '@angular/platform-browser/animations'
import {provideRouter} from '@angular/router'

import {DatabaseService} from '@core/db/database.service'

import {AppComponent} from './app/app.component'
import ROOT_ROUTES from './app/app.routes'


// noinspection JSIgnoredPromiseFromCall
bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(ROOT_ROUTES),
        provideAnimations(),
        {provide: DatabaseService, useClass: DatabaseService},
    ]
})
