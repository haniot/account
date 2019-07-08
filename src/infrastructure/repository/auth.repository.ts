/**
 * Implementation of the auth repository.
 *
 * @implements {IAuthRepository}
 */
import { inject, injectable } from 'inversify'
import { IAuthRepository } from '../../application/port/auth.repository.interface'
import { Identifier } from '../../di/identifiers'
import { User } from '../../application/domain/model/user'
import { UserEntity } from '../entity/user.entity'
import { Default } from '../../utils/default'
import jwt from 'jsonwebtoken'
import { RepositoryException } from '../../application/domain/exception/repository.exception'
import { Strings } from '../../utils/strings'
import { ChangePasswordException } from '../../application/domain/exception/change.password.exception'
import { AuthenticationException } from '../../application/domain/exception/authentication.exception'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { readFileSync } from 'fs'
import { BaseRepository } from './base/base.repository'
import { ILogger } from '../../utils/custom.logger'
import { IUserRepository } from '../../application/port/user.repository.interface'

@injectable()
export class AuthRepository extends BaseRepository<User, UserEntity> implements IAuthRepository {

    constructor(
        @inject(Identifier.USER_REPO_MODEL) readonly _userModel: any,
        @inject(Identifier.USER_ENTITY_MAPPER) readonly _userMapper: IEntityMapper<User, UserEntity>,
        @inject(Identifier.USER_REPOSITORY) readonly _userRepository: IUserRepository,
        @inject(Identifier.LOGGER) _logger: ILogger
    ) {
        super(_userModel, _userMapper, _logger)
    }

    public authenticate(_email: string, password: string): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            this._userModel.findOne({ email: _email })
                .exec()
                .then(async user => {
                    /* Validate password and generate access token*/
                    if (!user || !user.password || !this._userRepository.comparePasswords(password, user.password)) {
                        return reject(new AuthenticationException(
                            'Authentication failed due to invalid authentication credentials.'))
                    }

                    if (user.change_password) {
                        return reject(
                            new ChangePasswordException(
                                'Change password is necessary.',
                                `To ensure information security, the user must change the access password. ` +
                                `To change it, access PATCH /v1/auth/password.`,
                                `/v1/auth/password`))
                    }
                    // await this._userModel.findByIdAndUpdate(user.id, { last_login: new Date().toISOString() })
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
