import {bootstrapApplication} from '@angular/platform-browser'
import {AppComponent} from './app/app.component'
import {provideRouter} from '@angular/router'

import ROOT_ROUTES from "./app/app.routes"

// noinspection JSIgnoredPromiseFromCall
bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(ROOT_ROUTES)
    ]
})
