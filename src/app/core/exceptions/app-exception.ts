import {Type} from '@angular/core'

export class AppException extends Error {
    constructor(subject: string | Type<unknown>, message: string) {
        super(`${typeof subject === 'string' ? subject : subject.name}: ${message}`)
    }
}
