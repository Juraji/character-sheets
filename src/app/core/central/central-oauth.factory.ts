import {HttpClient} from '@angular/common/http';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import {JwksValidationHandler} from 'angular-oauth2-oidc-jwks';
import {firstValueFrom, mergeMap, tap} from 'rxjs';

export function centralOAuthFactory(oAuthService: OAuthService, httpClient: HttpClient) {
    return () => {
        const setup$ = httpClient.get<AuthConfig>('/assets/central-config.json')
            .pipe(
                tap(config => {
                    oAuthService.configure(config)
                    oAuthService.tokenValidationHandler = new JwksValidationHandler()
                }),
                mergeMap(() => oAuthService.loadDiscoveryDocument()),
                tap(() => oAuthService.setupAutomaticSilentRefresh())
            )

        return firstValueFrom(setup$)
    }
}
