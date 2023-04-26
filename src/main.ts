import {bootstrapApplication} from '@angular/platform-browser'
import {provideAnimations} from '@angular/platform-browser/animations'
import {provideRouter} from '@angular/router'

import {provideDb} from '@db/init';

import {AppComponent} from './app/app.component'
import ROOT_ROUTES from './app/app.routes'


// noinspection JSIgnoredPromiseFromCall
bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(ROOT_ROUTES),
        provideAnimations(),
        provideDb()
    ]
})
