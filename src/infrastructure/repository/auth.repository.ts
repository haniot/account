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
import bcrypt from 'bcryptjs'
import { BaseRepository } from './base/base.repository'
import { ILogger } from '../../utils/custom.logger'

@injectable()
export class AuthRepository extends BaseRepository<User, UserEntity> implements IAuthRepository {

    constructor(
        @inject(Identifier.USER_REPO_MODEL) readonly _userModel: any,
        @inject(Identifier.USER_ENTITY_MAPPER) readonly _userMapper: IEntityMapper<User, UserEntity>,
        @inject(Identifier.LOGGER) _logger: ILogger
    ) {
        super(_userModel, _userMapper, _logger)
    }

    /**
     * Change the user password.
     *
     * @param userEmail
     * @param oldPassword
     * @param newPassword
     * @return {Promise<boolean>} True if the password was changed or False, otherwise.
     * @throws {ValidationException | RepositoryException}
     */
    public changePassword(userEmail: string, oldPassword: string, newPassword: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.Model.findOne({ email: userEmail })
                .then((user: { password: string | undefined; change_password: boolean; }) => {
                    if (!user) return resolve(false)
                    if (!this.comparePasswords(oldPassword, user.password)) {
                        return reject(new ChangePasswordException(
                            Strings.USER.PASSWORD_NOT_MATCH,
                            Strings.USER.PASSWORD_NOT_MATCH_DESCRIPTION
                        ))
                    }
                    user.password = this.encryptPassword(newPassword)
                    user.change_password = false
                    this.Model.findOneAndUpdate({ email: userEmail }, user, { new: true })
                        .then(result => resolve(!!result))
                        .catch(err => reject(this.mongoDBErrorListener(err)))
                }).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    /**
     * Encrypt the user password.
     *
     * @param password
     * @return {string} Encrypted password if the encrypt was successfully.
     */
    public encryptPassword(password: string | undefined): string {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }

    /**
     * Compare if two passwords match.
     *
     * @param passwordOne The not hash password
     * @param passwordTwo The hash password
     * @return True if the passwords matches, false otherwise.
     */
    public comparePasswords(passwordOne: string, passwordTwo: string | undefined): boolean {
        return bcrypt.compareSync(passwordOne, passwordTwo)
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

                    if (!this.comparePasswords(password, user.password)) {
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
