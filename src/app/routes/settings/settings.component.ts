import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';

import {CardComponent} from '@components/card';
import {ReadOnlyFieldComponent} from '@components/read-only-field';


@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, CardComponent, TranslateModule, ReadOnlyFieldComponent],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {

}
