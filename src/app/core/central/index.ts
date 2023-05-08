import {HttpClient} from '@angular/common/http';
import {APP_INITIALIZER, EnvironmentProviders, Provider} from '@angular/core';
import {OAuthService, OAuthStorage, provideOAuthClient} from 'angular-oauth2-oidc';

import {centralOAuthFactory} from './central-oauth.factory';
import {CentralService} from './central.service';
import {oauthStorageFactory} from './oauth-storage.factory';

export * from './central.service';
export * from './central-couch-db-credentials';

export function provideCentral(): (Provider | EnvironmentProviders)[] {
    return [
        provideOAuthClient(),
        {provide: OAuthStorage, useFactory: oauthStorageFactory},
        {provide: APP_INITIALIZER, useFactory: centralOAuthFactory, deps: [OAuthService, HttpClient], multi: true},
        {provide: CentralService, useClass: CentralService, deps: [OAuthService]}
    ]
}
