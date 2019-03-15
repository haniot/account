/**
 * Class that defines variables with default values.
 *
 * @see Variables defined in .env will have preference.
 * @see Be careful not to put critical data in this file as it is not in .gitignore.
 * Sensitive data such as database, passwords and keys should be stored in secure locations.
 *
 * @abstract
 */
export abstract class Strings {
    public static readonly APP: any = {
        TITLE: 'Account Service',
        APP_DESCRIPTION: 'Micro-service for Account.'
    }

    public static readonly USER: any = {
        EMAIL_ALREADY_REGISTERED: 'A user with this email already registered!',
        USERNAME_ALREADY_REGISTERED: 'A user with this username already registered!',
        NOT_FOUND: 'User not found!',
        NOT_FOUND_DESCRIPTION: 'User not found or already removed. A new operation for the same resource is not required.',
        PASSWORD_NOT_MATCH: 'Password does not match!',
        PASSWORD_NOT_MATCH_DESCRIPTION: 'The old password parameter does not match with the actual user password.'
    }

    public static readonly ADMIN: any = {
        NOT_FOUND: 'Admin not found!',
        NOT_FOUND_DESCRIPTION: 'Admin not found or already removed. A new operation for the same resource is not required.',
    }

    public static readonly HEALTH_PROFESSIONAL: any = {
        NOT_FOUND: 'Health Professional not found!',
        NOT_FOUND_DESCRIPTION: 'Health Professional not found or already removed.' +
            ' A new operation for the same resource is not required.'
    }

    public static readonly ERROR_MESSAGE: any = {
        UNEXPECTED: 'An unexpected error has occurred. Please try again later...',
        UUID_NOT_VALID_FORMAT: 'Some ID provided does not have a valid format!',
        UUID_NOT_VALID_FORMAT_DESC: 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.'
    }
}
