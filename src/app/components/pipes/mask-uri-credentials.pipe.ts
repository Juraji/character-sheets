import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'maskUriCredentials',
    standalone: true
})
export class MaskUriCredentialsPipe implements PipeTransform {

    public transform(value: Optional<string>): Optional<string> {
        if (!value) return value

        const url = new URL(value)
        if (!!url.username) url.username = '***'
        if (!!url.password) url.password = '***'

        return url.toString()
    }

}
