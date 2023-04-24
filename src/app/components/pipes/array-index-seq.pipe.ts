import {Pipe, PipeTransform} from '@angular/core';

import {generateArray} from '@core/util/sequences'

@Pipe({
    name: 'arrayIndexSeq',
    standalone: true
})
export class ArrayIndexSeqPipe implements PipeTransform {

    public transform(length: Optional<number>): number[] {
        if (!!length) return generateArray(0, p => p < length - 1 ? p + 1 : null)
        else return []
    }

}
