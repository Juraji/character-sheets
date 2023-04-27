import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {CardComponent} from '@components/card';
import {MainMenuComponent} from '@components/main-menu';
import {MaskUriCredentialsPipe, NotPipe} from '@components/pipes';
import {ReadOnlyFieldComponent} from '@components/read-only-field';
import {TwoFactorButtonComponent} from '@components/two-factor-button';
import {ModelFormGroup} from '@core/forms';

import {SettingsStore} from './settings.store';


@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, CardComponent, TranslateModule, ReadOnlyFieldComponent, MainMenuComponent, ReactiveFormsModule, NotPipe, TwoFactorButtonComponent, MaskUriCredentialsPipe],
    providers: [SettingsStore],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
    public readonly couchDbSyncFormGroup = new ModelFormGroup({
        couchDbSyncUri: new FormControl<string>('', [Validators.required])
    });

    constructor(
        public readonly store: SettingsStore
    ) {
    }

    public onCouchDbSyncFormSubmit() {
        if (this.couchDbSyncFormGroup.invalid) return
        const uri = this.couchDbSyncFormGroup.value.couchDbSyncUri as string

        this.store.enableCouchDBSync(uri)
    }

    public onRemoveCouchDbSync() {
        this.store.disableCouchDBSync()
    }
}
