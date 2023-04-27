import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {CardComponent} from '@components/card';
import {StringListComponent} from '@components/string-list';

import {SettingsStore} from '../settings.store';


@Component({
    selector: 'app-species-settings',
    standalone: true,
    imports: [CommonModule, TranslateModule, CardComponent, StringListComponent, ReactiveFormsModule],
    templateUrl: './species-settings.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpeciesSettingsComponent {

    constructor(public readonly store: SettingsStore) {
    }

}
