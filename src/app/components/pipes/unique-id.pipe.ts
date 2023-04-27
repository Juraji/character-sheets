import {Pipe, PipeTransform} from '@angular/core';
import {v4 as uuidV4} from 'uuid';

@Pipe({
    name: 'uniqueId',
    standalone: true
})
export class UniqueIdPipe implements PipeTransform {

    public transform(id: Optional<string>): string {
        return `${id}-${uuidV4().substring(0, 7)}`;
    }

}
