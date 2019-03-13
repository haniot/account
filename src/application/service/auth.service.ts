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

@injectable()
export class AuthService implements IAuthService {

    constructor(@inject(Identifier.AUTH_REPOSITORY) private readonly _authRepository: IAuthRepository) {
    }

    public authenticate(email: string, password: string): Promise<object> {
        AuthValidator.validate(email, password)
        return this._authRepository.authenticate(email, password)
    }
}
