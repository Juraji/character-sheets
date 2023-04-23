import {Pipe, PipeTransform} from '@angular/core';

import {numberSequence} from '@core/util/sequences'

@Pipe({
    name: 'arrayIndexSeq',
    standalone: true
})
export class ArrayIndexSeqPipe implements PipeTransform {

    public transform(length: Nullable<number>): number[] {
        if (!!length) return Array.from(numberSequence(length - 1))
        else return []
    }

}
