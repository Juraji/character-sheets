import {Directive, OnDestroy, OnInit, Optional, Self, SkipSelf} from '@angular/core';
import {AbstractControl, ControlContainer} from '@angular/forms'

import {takeUntilDestroyed} from '@core/rxjs'

@Directive({
    selector: 'input[appValidateControl],select[appValidateControl],textarea[appValidateControl]',
    standalone: true
})
export class ValidateControlDirective implements OnInit, OnDestroy {

    constructor(
        @Optional() @SkipSelf() private readonly controlContainer: ControlContainer,
        @Self() private readonly abstractControl: AbstractControl
    ) {
    }

    public ngOnInit() {
        this.abstractControl.statusChanges
            .pipe(
                takeUntilDestroyed(this),

            )
    }

    public ngOnDestroy() {
    }

}
