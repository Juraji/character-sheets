import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown'

import {FilterNotNullPipe} from '@components/pipes/filter-not-null.pipe'
import {ComponentWithUniqueId} from '@core/util/component-with-unique-id'

type BtnColor =
    'btn-primary' |
    'btn-secondary' |
    'btn-success' |
    'btn-info' |
    'btn-warning' |
    'btn-danger' |
    'btn-light' |
    'btn-dark' |
    'btn-outline-primary' |
    'btn-outline-secondary' |
    'btn-outline-success' |
    'btn-outline-info' |
    'btn-outline-warning' |
    'btn-outline-danger' |
    'btn-outline-light' |
    'btn-outline-dark'

type BtnSize = 'btn-sm' | 'btn-lg'

@Component({
    selector: 'app-two-factor-button',
    standalone: true,
    imports: [CommonModule, BsDropdownModule, FilterNotNullPipe],
    templateUrl: './two-factor-button.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class TwoFactorButtonComponent extends ComponentWithUniqueId implements OnInit{

    @Input()
    public confirmText: Nullable<string>

    @Input()
    public btnColor: BtnColor = 'btn-primary'

    @Input()
    public btnSize: Nullable<BtnSize>

    @Output()
    public readonly confirmed: EventEmitter<void> = new EventEmitter()

    constructor() {
        super('two-factor-button')
    }
}
