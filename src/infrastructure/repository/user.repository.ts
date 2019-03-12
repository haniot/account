import { inject, injectable } from 'inversify'
import { User } from '../../application/domain/model/user'
import { Identifier } from '../../di/identifiers'
import { IUserRepository } from '../../application/port/user.repository.interface'
import { UserEntity } from '../entity/user.entity'
import { BaseRepository } from './base/base.repository'
import { IEntityMapper } from '../entity/mapper/entity.mapper.interface'
import { Query } from './query/query'
import { IQuery } from '../../application/port/query.interface'
import { ILogger } from '../../utils/custom.logger'
import { ChangePasswordException } from '../../application/domain/exception/change.password.exception'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Default } from '../../utils/default'
import { UserType } from '../../application/domain/utils/user.type'
import { AuthenticationException } from '../../application/domain/exception/authentication.exception'

/**
 * Implementation of the user repository.
 *
 * @implements {IUserRepository}
 */
@injectable()
export class UserRepository extends BaseRepository<User, UserEntity> implements IUserRepository {
    constructor(
        @inject(Identifier.USER_REPO_MODEL) protected readonly userModel: any,
        @inject(Identifier.USER_ENTITY_MAPPER) protected readonly userMapper: IEntityMapper<User, UserEntity>,
        @inject(Identifier.LOGGER) readonly logger: ILogger
    ) {
        super(userModel, userMapper, logger)
    }

    /**
     * Create a new user.
     *
     * @param user
     * @return {Promise<User>} User, if the save was successful.
     * @throws {ValidationException | RepositoryException}
     * @override
     */
    public create(user: User): Promise<User> {
        user.setPassword(this.encryptPassword(user.getPassword()))
        return super.create(user)
    }

    /**
     * Retrieves the user by your email.
     *
     * @param e User email.
     * @param query Defines object to be used for queries.
     * @return {Promise<User>}
     * @throws {RepositoryException}
     */
    public async getByEmail(e: string, query: IQuery): Promise<User> {
        query.filters = { email: e }
        return super.findOne(query)
    }

    /**
     * Checks if an user already has a registration.
     * What differs one user to another is your email.
     *
     * @param user
     * @return {Promise<boolean>} True if it exists or False, otherwise.
     * @throws {ValidationException | RepositoryException}
     */
    public checkExist(user: User): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const email: any = user.getEmail() ? user.getEmail() : ''
            this.getByEmail(email, new Query())
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
            this.userModel.findOne({ _id: id })
                .then((user) => {
                    if (!user) return resolve(false)
                    if (!this.comparePasswords(old_password, user.password)) {
                        return reject(new ChangePasswordException(
                            'Password does not match',
                            'The old password parameter does not match with the actual user password.'
                        ))
                    }
                    user.password = this.encryptPassword(new_password)
                    user.change_password = false
                    this.userModel.findOneAndUpdate({ _id: user.id }, user, { new: true })
                        .exec()
                        .then(result => {
                            if (!result) return resolve(false)
                            return resolve(true)
                        })
                        .catch(err => reject(this.mongoDBErrorListener(err)))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
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

    /**
     * Authenticate a user.
     *
     * @param email
     * @param password
     * @return {Promise<boolean>} True if the password was changed or False, otherwise.
     * @throws {ChangePasswordExeption}
     */
    public authenticate(userMail: string, password: string): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            return this.userModel.findOne({ email: userMail })
                .then(user => {
                    if (!user || !this.comparePasswords(password, user.password)) {
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
                                `To ensure information security, the user must change the access password.` +
                                `To change it, access PATCH /api/v1/users/${user._id}/password.`,
                                `/api/v1/users/${user._id}/password`))
                    }
                    resolve(this.generateToken(user))
                }).catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    /**
     * Generate a token by user data.
     *
     * @param user
     * @return {token} The generated token.
     */
    public generateToken(user: any): object {

        const payload: any = {
            sub: user._id,
            iss: 'haniot',
            iat: Math.round(Date.now() / 1000),
            exp: Math.round(Date.now() / 1000 + 24 * 60 * 60)
        }

        payload.scope =
            user.type === UserType.ADMIN ?
                'caregiverAccount:create caregiverAccount:deleteAll ' +
                'caregiverAccount:readAll caregiverAccount:updateAll adminAccount:create ' +
                'adminAccount:deleteAll adminAccount:readAll adminAccount:updateAll'
                :
                'caregiverAccount:delete caregiverAccount:read ' +
                'caregiverAccount:update'

        const secret: string = process.env.JWT_SECRET || Default.JWT_SECRET
        const userToken: object = { token: jwt.sign(payload, secret) }

        return userToken
    }
}
