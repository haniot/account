import { Exception } from './exception'

/**
 * Change Password Exception
 *
 * @extends {Exception}
 */
export class ChangePasswordException extends Exception {
    public link?: string
    /**
     * Creates an instance of ChangePasswordException.
     *
     * @param message Short message
     * @param description Detailed message
     * @param link Access link to change password.
     */
    constructor(message: string, description?: string, link?: string) {
        super(message, description)
        this.link = link
    }
}
