import { Admin } from '../model/admin'
import { ValidationException } from '../exception/validation.exception'
import { EmailValidator } from './email.validator'

export class CreateAdminValidator {
    public static validate(user: Admin): void | ValidationException {
        const fields: Array<string> = []

        if (!user.email) fields.push('email')
        else EmailValidator.validate(user.email)
        if (!user.password) fields.push('password')

        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'User validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
