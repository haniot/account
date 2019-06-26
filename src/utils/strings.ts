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

    public static readonly PARAMETERS: any = {
        COULD_NOT_BE_UPDATED: 'This parameter could not be updated!'
    }

    public static readonly ENUM_VALIDATOR: any = {
        NOT_MAPPED: 'Value not mapped for ',
        NOT_MAPPED_DESC: 'The mapped values are: '
    }

    public static readonly USER: any = {
        EMAIL_ALREADY_REGISTERED: 'A user with this email already registered!',
        NOT_FOUND: 'User not found!',
        NOT_FOUND_DESCRIPTION: 'User not found or already removed. A new operation for the same resource is required!',
        PASSWORD_NOT_MATCH: 'Password does not match!',
        PASSWORD_NOT_MATCH_DESCRIPTION: 'The old password parameter does not match with the actual user password.'
    }

    public static readonly ADMIN: any = {
        NOT_FOUND: 'Admin not found!',
        NOT_FOUND_DESCRIPTION: 'Admin not found or already removed. A new operation for the same resource is required.'
    }

    public static readonly PATIENT: any = {
        NOT_FOUND: 'Patient not found!',
        NOT_FOUND_DESCRIPTION: 'Patient not found or already removed. A new operation for the same resource is required.',
        ASSOCIATION_FAILURE: 'The association could not be performed because the patient does not have a record.'
    }

    public static readonly HEALTH_PROFESSIONAL: any = {
        NOT_FOUND: 'Health Professional not found!',
        NOT_FOUND_DESCRIPTION: 'Health Professional not found or already removed.' +
            ' A new operation for the same resource is required.',
        HEALTH_PROFESSIONAL_REGISTER_REQUIRED: 'It is necessary for health professional to be registered before ' +
            'proceeding.',
        IDS_WITHOUT_REGISTER: 'The following IDs were verified without registration:',
        ASSOCIATION_FAILURE: 'The association could not be performed because the health professional does not have a ' +
            'record.'
    }

    public static readonly ERROR_MESSAGE: any = {
        UNEXPECTED: 'An unexpected error has occurred. Please try again later...',
        UUID_NOT_VALID_FORMAT: 'Some ID provided does not have a valid format!',
        UUID_NOT_VALID_FORMAT_DESC: 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.',
        PARAMETER_COULD_NOT_BE_UPDATED: 'This parameter could not be updated.',
        DATE_NOT_VALID_FORMAT_DESC: 'Date must be in the format: yyyy-MM-dd'
    }

    public static readonly PILOT_STUDY: any = {
        NOT_FOUND: 'Pilot Study not found!',
        NOT_FOUND_DESCRIPTION: 'Pilot Study not found or already removed. ' +
            'A new operation for the same resource is required.',
        ASSOCIATION_FAILURE: 'The association could not be performed because the pilot study does not have a record.',
        DISASSOCIATION_FAILURE: 'The disassociation could not be performed because the pilot study does not have a record.',
        NAME_ALREADY_REGISTERED: 'A ṕilot study with this name already registered!'
    }

}
