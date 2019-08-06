/**
 * Implementing auth Service.
 *
 */
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IAuthService } from '../port/auth.service.interface'
import { IAuthRepository } from '../port/auth.repository.interface'
import { AuthValidator } from '../domain/validator/auth.validator'
import { IUserRepository } from '../port/user.repository.interface'

@injectable()
export class AuthService implements IAuthService {

    constructor(
        @inject(Identifier.AUTH_REPOSITORY) private readonly _authRepository: IAuthRepository,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository) {
    }

    public async authenticate(email: string, password: string): Promise<object> {
        AuthValidator.validate(email, password)
        const result: object = await this._authRepository.authenticate(email, password)
        if (result) await this._userRepository.updateLastLogin(email)
        return Promise.resolve(result)
    }
}
