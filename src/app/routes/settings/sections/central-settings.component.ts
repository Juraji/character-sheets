import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {filter, Observable} from 'rxjs';

import {CardComponent} from '@components/card';
import {CentralService} from '@core/central';
import {takeUntilDestroyed} from '@core/rxjs';


@Component({
    selector: 'app-central-settings',
    standalone: true,
    imports: [CommonModule, CardComponent, TranslateModule],
    templateUrl: './central-settings.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CentralSettingsComponent implements OnDestroy {

    public readonly isAuthenticated$: Observable<boolean> =
        this.centralService.isAuthenticated$
    public readonly centralUsername$: Observable<Optional<string>> =
        this.centralService.getIdClaim<string>('sub')

    constructor(
        private readonly centralService: CentralService,
        private readonly activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.queryParamMap
            .pipe(takeUntilDestroyed(this), filter(it => it.has('code')))
            .subscribe(() => this.centralService.catchCallback())
    }

    public ngOnDestroy() {
    }

    public onConnect() {
        this.centralService.login()
    }

    public onDisconnect() {
        this.centralService.logout()
    }
}
