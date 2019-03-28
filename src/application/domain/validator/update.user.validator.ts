import { ValidationException } from '../exception/validation.exception'
import { User } from '../model/user'
import { ObjectIdValidator } from './object.id.validator'
import { Strings } from '../../../utils/strings'

export class UpdateUserValidator {
    public static validate(user: User): void | ValidationException {
        if (user.id) ObjectIdValidator.validate(user.id)
        if (user.password) {
            throw new ValidationException(Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED,
                'A specific route to update user password already exists. ' +
                `Access: PATCH /users/${user.id}/password to update your password.`)
        }
    }
}
