import { ValidationException } from '../exception/validation.exception'
import { User } from '../model/user'

export class CreateUserValidator {
    public static validate(user: User): void | ValidationException {
        const fields: Array<string> = []

        if (!user.password) fields.push('password')

        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'User validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
