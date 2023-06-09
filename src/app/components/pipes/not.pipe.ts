import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'not',
    standalone: true
})
export class NotPipe implements PipeTransform {

    public transform(value: unknown): boolean {
        return !value || (typeof value === 'object' && 'length' in value && value.length === 0);
    }

}
