import { ValidationException } from '../exception/validation.exception'
import { User } from '../model/user'
import { EmailValidator } from './email.validator'

export class UserUpdateValidator {
    public static validate(user: User): void | ValidationException {

        // validate if the email is valid if an email update has been requested
        if (user.getEmail()) EmailValidator.validate(user.getEmail())

        // validate parameters that can not be updated.
        if (user.getType()) {
            throw new ValidationException('This parameter could not be updated.',
                'The type of user could not be updated.')
        }

        if (user.getPassword()) {
            throw new ValidationException('This parameter could not be updated.',
                'A specific route to update user password already exists.' +
                `Access: PATCH /api/v1/users/${user.getId()}/password to update your password.`)
        }
    }
}
