import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

import {BooleanInput} from '@core/util/boolean-input';
import {Attachment} from '@db/model/core';

@Component({
    selector: 'app-attachment-img',
    standalone: true,
    imports: [CommonModule],
    template: '<!--suppress AngularNgOptimizedImage --><img class="attachment-img" [src]="objUrl$ | async" [alt]="alt" />',
    styleUrls: ['./attachment-img.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttachmentImgComponent implements OnChanges {

    public readonly objUrl$: BehaviorSubject<Optional<string>> = new BehaviorSubject<Optional<string>>(null)

    @Input()
    public attachment: Optional<Attachment>

    @Input()
    public alt: Optional<string>

    @Input()
    @BooleanInput()
    public fitContainer: boolean | string = false

    public ngOnChanges(changes: SimpleChanges) {
        if ('attachment' in changes) {
            const att: Attachment = changes['attachment'].currentValue
            const prev = this.objUrl$.value

            // Releases previous object url
            if (!!prev) URL.revokeObjectURL(prev)

            const next = !!att && att.contentType.startsWith('image/')
                ? URL.createObjectURL(att.content)
                : null

            this.objUrl$.next(next)
        }
    }
}
