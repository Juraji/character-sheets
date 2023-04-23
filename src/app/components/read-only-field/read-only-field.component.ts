import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, HostBinding, Input, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {v4 as uuidV4} from 'uuid'

import {BooleanInput} from '@core/util/boolean-input'

@Component({
    selector: 'app-read-only-field',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './read-only-field.component.html',
    styleUrls: ['./read-only-field.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReadOnlyFieldComponent implements OnInit {
    private static idGenerator: Generator<string, string> = (function* () {
        while (true) yield uuidV4()
    })()

    @HostBinding('attr.id')
    public id = ''

    @Input()
    public label: Nullable<string>;

    @Input()
    @BooleanInput()
    public inline: Nullable<string | boolean> = false

    constructor() {
    }

    public ngOnInit() {
        this.id = `'app-read-only-field-${ReadOnlyFieldComponent.idGenerator.next().value}`
    }
}
