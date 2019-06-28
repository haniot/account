/**
 * Implementing auth Service.
 *
 * @implements {IChildService}
 */
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IAuthService } from '../port/auth.service.interface'
import { IAuthRepository } from '../port/auth.repository.interface'
import { AuthValidator } from '../domain/validator/auth.validator'
import { ChangePasswordValidator } from '../domain/validator/change.password.validator'

@injectable()
export class AuthService implements IAuthService {

    constructor(
        @inject(Identifier.AUTH_REPOSITORY) private readonly _authRepository: IAuthRepository) {
    }

    public authenticate(email: string, password: string): Promise<object> {
        AuthValidator.validate(email, password)
        return this._authRepository.authenticate(email, password)
    }

    /**
     * Change the user password.
     *
     * @param email - Email of user
     * @param old_password - Old user password.
     * @param new_password - New user password.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    public async changePassword(email: string, old_password: string, new_password: string): Promise<boolean> {
        try {
            ChangePasswordValidator.validate(email, old_password, new_password)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._authRepository.changePassword(email, old_password, new_password)
    }

}
