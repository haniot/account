import { ValidationException } from '../exception/validation.exception'

export class AuthValidator {
    public static validate(email: string, password: string): void | ValidationException {
        const fields: Array<string> = []

        // validate null
        if (!email) fields.push('email')
        if (!password) fields.push('password')

        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'Authentication validation: '.concat(fields.join(', ')).concat(' is required!'))
        }
    }
}
