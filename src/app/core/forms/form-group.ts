import {AbstractControl, FormGroup} from '@angular/forms'
import {Observable} from 'rxjs';

type AbstractControlMapOf<T> = { [K in keyof T]: AbstractControl<T[K]> }

/* eslint-disable @typescript-eslint/ban-ts-comment */
/**
 * This class mainly exists to simplify usage of Form groups and align its interface
 * with how we use the FormGroup class.
 *
 * Most of the overrides are interface corrections where the original interface would return {} or Partial<T>,
 * which is not true. Hence, the ts-ignore tags.
 */
export class ModelFormGroup<T> extends FormGroup<AbstractControlMapOf<T>> {

    // @ts-ignore
    public readonly value: T

    // @ts-ignore
    public readonly valueChanges: Observable<T>

    // @ts-ignore
    public getRawValue(): T {
        return super.getRawValue() as T;
    }

    // @ts-ignore
    public patchValue(value: Partial<T>, options?: { onlySelf?: boolean; emitEvent?: boolean }) {
        super.patchValue(value as never, options);
    }
}
