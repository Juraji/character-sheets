import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {TranslateModule} from '@ngx-translate/core';

import {UniqueIdPipe} from '@components/pipes';
import {BooleanInput} from '@core/util/boolean-input'

@Component({
    selector: 'app-read-only-field',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, UniqueIdPipe],
    templateUrl: './read-only-field.component.html',
    styleUrls: ['./read-only-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadOnlyFieldComponent {

    @Input()
    public label: Optional<string>;

    @Input()
    @BooleanInput()
    public inline: Optional<string | boolean> = false
}
