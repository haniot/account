/**
 * Implementation of the auth repository.
 *
 * @implements {IAuthRepository}
 */
import { inject, injectable } from 'inversify'
import { IAuthRepository } from '../../application/port/auth.repository.interface'
import { Identifier } from '../../di/identifiers'
import { User } from '../../application/domain/model/user'
import { IUserRepository } from '../../application/port/user.repository.interface'
import { UserEntity } from '../entity/user.entity'
import { Default } from '../../utils/default'
import jwt from 'jsonwebtoken'
import { RepositoryException } from '../../application/domain/exception/repository.exception'
import { Strings } from '../../utils/strings'
import { ChangePasswordException } from '../../application/domain/exception/change.password.exception'
import { AuthenticationException } from '../../application/domain/exception/authentication.exception'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { readFileSync } from 'fs'

@injectable()
export class AuthRepository implements IAuthRepository {

    constructor(
        @inject(Identifier.USER_REPO_MODEL) readonly _userModel: any,
        @inject(Identifier.USER_ENTITY_MAPPER) readonly _userMapper: IEntityMapper<User, UserEntity>,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository
    ) {
    }

    public authenticate(_email: string, password: string): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            this._userModel.findOne({ email: _email })
                .exec()
                .then(async user => {
                    /* Validate password and generate access token*/
                    if (!user || !user.password) {
                        return reject(
                            new AuthenticationException(
                                'Authentication failed due to invalid authentication credentials.'
                            )
                        )
                    }

                    if (!this._userRepository.comparePasswords(password, user.password)) {
                        return reject(
                            new AuthenticationException(
                                'Authentication failed due to invalid authentication credentials.'
                            )
                        )
                    }

                    if (user.change_password) {
                        return reject(
                            new ChangePasswordException(
                                'Change password is necessary.',
                                `To ensure information security, the user must change the access password. ` +
                                `To change it, access PATCH /users/${user._id}/password.`,
                                `/users/${user._id}/password`))
                    }
                    await this._userModel.findOneAndUpdate({ _id: user.id }, { last_login: new Date().toISOString() })
                    return resolve({ access_token: await this.generateAccessToken(this._userMapper.transform(user)) })
                }).catch(err => reject(new RepositoryException(Strings.ERROR_MESSAGE.UNEXPECTED)))
        })
    }

    public generateAccessToken(user: User): Promise<string> {
        try {
            const private_key = readFileSync(`${process.env.JWT_PRIVATE_KEY_PATH}`, 'utf-8')
            const payload: object = {
                sub: user.id,
                sub_type: user.type,
                iss: process.env.ISSUER || Default.ISSUER,
                iat: Math.floor(Date.now() / 1000),
                scopes: user.scopes.join(' '),
                email_verified: user.email_verified,
                change_password: user.change_password
            }
            return Promise.resolve(jwt.sign(payload, private_key, { expiresIn: '1d', algorithm: 'RS256' }))
        } catch (err) {
            return Promise.reject(
                new AuthenticationException('Authentication failed due to failure at generate the access token.'))
        }
    }
}
