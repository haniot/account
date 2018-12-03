import { Exception } from './exception'

export class AuthenticationException extends Exception {
    /**
     * Creates an instance of Authentication Exception.
     *
     * @param message Short message
     * @param description Detailed message
     */
    constructor(message: string, description?: string) {
        super(message, description)
    }
}
