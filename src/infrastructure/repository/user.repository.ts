import { inject, injectable } from 'inversify'
import { User } from '../../application/domain/model/user'
import { Identifier } from '../../di/identifiers'
import { IUserRepository } from '../../application/port/user.repository.interface'
import { UserEntity } from '../entity/user.entity'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { BaseRepository } from './base/base.repository'
import { ILogger } from '../../utils/custom.logger'
import { ChangePasswordException } from '../../application/domain/exception/change.password.exception'
import bcrypt from 'bcryptjs'
import { Query } from './query/query'
import { Strings } from '../../utils/strings'

/**
 * Implementation of the user repository.
 *
 * @implements {IUserRepository}
 */
@injectable()
export class UserRepository extends BaseRepository<User, UserEntity> implements IUserRepository {
    constructor(
        @inject(Identifier.USER_REPO_MODEL) protected readonly _userModel: any,
        @inject(Identifier.USER_ENTITY_MAPPER) protected readonly _userMapper: IEntityMapper<User, UserEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_userModel, _userMapper, _logger)
    }

    /**
     * Checks if an user already has a registration with email.
     * What differs one user to another is your email.
     *
     * @return {Promise<boolean>} True if it exists or False, otherwise.
     * @throws {ValidationException | RepositoryException}
     * @param _email
     *
     */
    public async checkExist(_email?: string): Promise<boolean> {
        const query = new Query()
        if (_email !== undefined) query.addFilter({ email: _email })
        return new Promise<boolean>((resolve, reject) => {
            super.findOne(query)
                .then((result: User) => {
                    if (result) return resolve(true)
                    return resolve(false)
                }).catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    /**
     * Change the user password.
     *
     * @param id
     * @param old_password
     * @param new_password
     * @return {Promise<boolean>} True if the password was changed or False, otherwise.
     * @throws {ValidationException | RepositoryException}
     */
    public changePassword(id: string, old_password: string, new_password: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.Model.findOne({ _id: id })
                .then((user) => {
                    if (!user) return resolve(false)
                    if (!this.comparePasswords(old_password, user.password)) {
                        return reject(new ChangePasswordException(
                            Strings.USER.PASSWORD_NOT_MATCH,
                            Strings.USER.PASSWORD_NOT_MATCH_DESCRIPTION
                        ))
                    }
                    user.password = this.encryptPassword(new_password)
                    user.change_password = false
                    this.Model.findOneAndUpdate({ _id: id }, user, { new: true })
                        .then(result => {
                            if (!result) return resolve(false)
                            return resolve(true)
                        }).catch(err => reject(this.mongoDBErrorListener(err)))
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
     * @param password_one The not hash password
     * @param password_two The hash password
     * @return True if the passwords matches, false otherwise.
     */
    public comparePasswords(password_one: string, password_two: string | undefined): boolean {
        return bcrypt.compareSync(password_one, password_two)
    }
}
