import { ValidationException } from '../exception/validation.exception'
import { EmailValidator } from './email.validator'
import { UpdateUserValidator } from './update.user.validator'
import { Admin } from '../model/admin'

export class UpdateAdminValidator {
    public static validate(user: Admin): void | ValidationException {
        if (user.email) EmailValidator.validate(user.email)
        UpdateUserValidator.validate(user)
    }
}
