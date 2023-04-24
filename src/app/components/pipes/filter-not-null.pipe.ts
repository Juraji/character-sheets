import {Pipe, PipeTransform} from '@angular/core';

import {isNotNullable} from '@core/util/objects';

@Pipe({
    name: 'filterNotNull',
    standalone: true
})
export class FilterNotNullPipe implements PipeTransform {

    public transform<T, U extends Optional<T>>(value: U[]): NonNullable<U[]> {
        return value.filter(isNotNullable);
    }

}
