import {Injectable, OnDestroy} from '@angular/core';
import {EventType, OAuthInfoEvent, OAuthService} from 'angular-oauth2-oidc';
import {delay, filter, map, Observable, startWith} from 'rxjs';

import {CentralCouchDBCredentials} from './central-couch-db-credentials';

const TOKEN_EVENTS: EventType[] = ['user_profile_loaded', 'token_received', 'logout']

@Injectable()
export class CentralService implements OnDestroy {

    public readonly isAuthenticated$: Observable<boolean> = this.oAuthService.events
        .pipe(
            filter(it => TOKEN_EVENTS.includes(it.type)),
            startWith(new OAuthInfoEvent(!!this.oAuthService.getAccessToken() ? 'user_profile_loaded' : 'logout')),
            map(e => e.type !== 'logout'),
        )
    public readonly couchDBCredentials$: Observable<CentralCouchDBCredentials | null> = this.isAuthenticated$
        .pipe(
            delay(500), // Needs a slight delay as granting db access takes a little
            map(hasAuth => hasAuth ? this.buildCentralCouchDBCredentials() : null)
        )

    constructor(private readonly oAuthService: OAuthService) {
    }

    public ngOnDestroy() {
    }

    public readonly login: () => void = this.oAuthService.initLoginFlow.bind(this.oAuthService)

    public readonly catchCallback: () => Promise<boolean> = this.oAuthService.tryLogin.bind(this.oAuthService)

    public readonly logout: () => void = this.oAuthService.logOut.bind(this.oAuthService)

    public getIdClaim<T extends string | number>(claimName: string): Observable<Optional<T>> {
        return this.isAuthenticated$.pipe(
            map(() => this.oAuthService.getIdentityClaims() ?? {}),
            map(claims => claims[claimName])
        );
    }

    private buildCentralCouchDBCredentials() {
        const claims: Record<string, unknown> = this.oAuthService.getIdentityClaims()

        return {
            databaseName: claims['couchdb_name'],
            username: claims['couchdb_username'],
            password: this.oAuthService.getAccessToken()
        } as CentralCouchDBCredentials
    }
}
