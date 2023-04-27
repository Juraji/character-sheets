import {CommonModule} from '@angular/common';
import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule, ValidatorFn, Validators} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {UniqueIdPipe} from '@components/pipes';
import {TwoFactorButtonComponent} from '@components/two-factor-button';

@Component({
    selector: 'app-string-list',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TranslateModule, TwoFactorButtonComponent, UniqueIdPipe],
    templateUrl: './string-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StringListComponent {

    public readonly inputFormControl: FormControl<string | null> = new FormControl<string>('', [Validators.required, this.noDuplicates])

    @Input()
    public value: string[] | null = null

    @Output()
    public readonly valueChange = new EventEmitter<string[]>()

    public onAddString() {
        if (this.inputFormControl.invalid) return
        const value = this.inputFormControl.value as string
        this.inputFormControl.setValue('')

        this.value = [...(this.value || []), value]
        this.valueChange.next(this.value)
    }

    public onRemoveString(str: string) {
        this.value = this.value?.filter(s => s !== str) || []
        this.valueChange.next(this.value)
    }

    private noDuplicates(): ValidatorFn {
        return c => !!this.value?.includes(c.value) ? {nuDuplicates: true} : null
    }
}
