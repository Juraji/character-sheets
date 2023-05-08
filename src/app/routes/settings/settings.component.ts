import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {CardComponent} from '@components/card';
import {MainMenuComponent} from '@components/main-menu';

import {CentralSettingsComponent, CombatClassSettingsComponent, SpeciesSettingsComponent} from './sections';
import {SettingsStore} from './settings.store';


@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, CardComponent, TranslateModule, MainMenuComponent, CentralSettingsComponent, CombatClassSettingsComponent, SpeciesSettingsComponent],
    providers: [SettingsStore],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {


    constructor(public readonly store: SettingsStore) {
    }
}
