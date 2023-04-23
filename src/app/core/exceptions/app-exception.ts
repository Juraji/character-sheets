export class AppException extends Error {
    constructor(subject: string, message: string) {
        super(`${subject}: ${message}`)
    }
}
