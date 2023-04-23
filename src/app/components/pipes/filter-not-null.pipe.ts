import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'filterNotNull',
    standalone: true
})
export class FilterNotNullPipe implements PipeTransform {

    public transform<T, U extends Nullable<T>>(value: U[]): NonNullable<U[]> {
        return value.filter(it => it !== null && it !== undefined);
    }

}
