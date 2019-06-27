import { ValidationException } from '../exception/validation.exception'
import { UpdateUserValidator } from './update.user.validator'
import { Admin } from '../model/admin'

export class UpdateAdminValidator {
    public static validate(user: Admin): void | ValidationException {
        UpdateUserValidator.validate(user)
    }
}
