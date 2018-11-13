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
import bcrypt from 'bcryptjs'

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
        @inject(Identifier.LOGGER) protected readonly logger: ILogger
    ) {
        super(userModel, userMapper, logger)
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
     * @param id
     * @param old_password
     * @param new_password
     * @return {Promise<boolean>} True if the password was changed or False, otherwise.
     * @throws {ValidationException | RepositoryException}
     */
    public changePassword(id: string, old_password: string, new_password: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const query: Query = new Query()
            query.filters = { _id: id }
            return super.findOne(query)
                .then((user: User) => {
                    if (!user || !bcrypt.compareSync(user.getPassword(), old_password)) return resolve(false)
                    user.setPassword(this.encryptPassword(new_password))
                    super.update(user)
                        .then((user: User) => {
                            if (!user) return resolve(false)
                            resolve(true)
                        }).catch(err => reject(super.mongoDBErrorListener(err)))
                    resolve(true)
                }).catch(err => reject(super.mongoDBErrorListener(err)))

            resolve(true)
        })
    }

    /**
     * Encrypt the user password
     * @param password
     * @return {string} Encrypted password if the encrypt was successfully.
     */
    public encryptPassword(password: string): string {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt)
    }
}
