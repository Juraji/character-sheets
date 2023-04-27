import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {BooleanInput} from '@core/util/boolean-input';

@Component({
    selector: 'app-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {

    @Input()
    @BooleanInput()
    public hideHeader: Optional<boolean | string> = false

    @Input()
    @BooleanInput()
    public flushBody: Optional<boolean | string> = false
}
