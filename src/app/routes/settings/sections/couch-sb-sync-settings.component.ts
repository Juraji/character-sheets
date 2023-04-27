import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {CardComponent} from '@components/card';
import {NotPipe} from '@components/pipes';
import {ReadOnlyFieldComponent} from '@components/read-only-field';
import {TwoFactorButtonComponent} from '@components/two-factor-button';
import {ModelFormGroup} from '@core/forms';

import {SettingsStore} from '../settings.store';

@Component({
    selector: 'app-couch-sb-sync-settings',
    standalone: true,
    imports: [CommonModule, CardComponent, TranslateModule, ReactiveFormsModule, TwoFactorButtonComponent, ReadOnlyFieldComponent, NotPipe],
    templateUrl: './couch-sb-sync-settings.component.html',
    styleUrls: ['./couch-sb-sync-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CouchSbSyncSettingsComponent {
    public readonly couchDbSyncFormGroup = new ModelFormGroup({
        couchDbSyncUri: new FormControl<string>('', [Validators.required])
    });

    constructor(public readonly store: SettingsStore) {
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
