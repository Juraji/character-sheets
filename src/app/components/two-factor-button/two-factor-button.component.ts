import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown'

import {FilterNotNullPipe} from '@components/pipes/filter-not-null.pipe'
import {ComponentWithUniqueId} from '@core/util/component-with-unique-id'

@Component({
    selector: 'app-two-factor-button',
    standalone: true,
    imports: [CommonModule, BsDropdownModule, FilterNotNullPipe],
    templateUrl: './two-factor-button.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TwoFactorButtonComponent extends ComponentWithUniqueId implements OnInit {

    @Input()
    public confirmText: Optional<string>

    @Input()
    public btnClass = ''

    @Output()
    public readonly confirmed: EventEmitter<void> = new EventEmitter()

    constructor() {
        super('two-factor-button')
    }
}
