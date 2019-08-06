import { ValidationException } from '../exception/validation.exception'
import { User } from '../model/user'
import { ObjectIdValidator } from './object.id.validator'
import { Strings } from '../../../utils/strings'
import { EmailValidator } from './email.validator'
import { DateValidator } from './date.validator'

export class UpdateUserValidator {
    public static validate(user: User): void | ValidationException {
        if (user.id) ObjectIdValidator.validate(user.id)
        if (user.email) EmailValidator.validate(user.email)
        if (user.birth_date) DateValidator.validate(user.birth_date)
        if (user.selected_pilot_study) ObjectIdValidator.validate(user.selected_pilot_study)
        if (user.password) {
            throw new ValidationException(Strings.ERROR_MESSAGE.PARAMETER_COULD_NOT_BE_UPDATED,
                'A specific route to update user password already exists. ' +
                `Access: PATCH /v1/auth/password to update your password.`)
        }
    }
}
