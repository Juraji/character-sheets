import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {TranslateModule} from '@ngx-translate/core';

import {BooleanInput} from '@core/util/boolean-input'
import {ComponentWithUniqueId} from '@core/util/component-with-unique-id'

@Component({
    selector: 'app-read-only-field',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
    templateUrl: './read-only-field.component.html',
    styleUrls: ['./read-only-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadOnlyFieldComponent extends ComponentWithUniqueId {

    @Input()
    public label: Optional<string>;

    @Input()
    @BooleanInput()
    public inline: Optional<string | boolean> = false

    constructor() {
        super('read-only-field')
    }
}
