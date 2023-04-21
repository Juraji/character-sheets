export class AppException extends Error {
    public constructor(subject: string, message: string) {
        super(`${subject}: ${message}`)
    }
}
