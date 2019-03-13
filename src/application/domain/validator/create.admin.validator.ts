import { Admin } from '../model/admin'
import { ValidationException } from '../exception/validation.exception'
import { CreateUserValidator } from './create.user.validator'

export class CreateAdminValidator {
    public static validate(user: Admin): void | ValidationException {
        const fields: Array<string> = []

        CreateUserValidator.validate(user)
        if (!user.email) fields.push('email')

        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'User validation failed: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
