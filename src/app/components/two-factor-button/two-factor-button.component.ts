import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown'

import {FilterNotNullPipe, UniqueIdPipe} from '@components/pipes'
import {BooleanInput} from '@core/util/boolean-input';

@Component({
    selector: 'app-two-factor-button',
    standalone: true,
    imports: [CommonModule, BsDropdownModule, FilterNotNullPipe, TranslateModule, UniqueIdPipe],
    templateUrl: './two-factor-button.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TwoFactorButtonComponent {

    @Input()
    public confirmText: Optional<string>

    @Input()
    public btnClass = ''

    @Input()
    @BooleanInput()
    public disabled: Optional<boolean | string> = false

    @Output()
    public readonly confirmed: EventEmitter<void> = new EventEmitter()

    constructor() {
    }

    protected readonly menubar = menubar;
}
