import { inject, injectable } from 'inversify'
import { User } from '../domain/model/user'
import { IUserService } from '../port/user.service.interface'
import { Identifier } from '../../di/identifiers'
import { IUserRepository } from '../port/user.repository.interface'
import { ConflictException } from '../domain/exception/conflict.exception'
import { UserCreateValidator } from '../domain/validator/user.create.validator'
import { IQuery } from '../port/query.interface'
import { UserUpdateValidator } from '../domain/validator/user.update.validator'
import { ChangePasswordValidator } from '../domain/validator/change.password.validator'

/**
 * Implementing User Service.
 *
 * @implements {IUserService}
 */
@injectable()
export class UserService implements IUserService {
    constructor(@inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository) {
    }

    /**
     * Adds a new user.
     * Before adding, it is checked whether the user already exists.
     *
     * @param {User} user
     * @returns {(Promise<User>)}
     * @throws {ConflictException | RepositoryException} If a data conflict occurs, as an existing user.
     */
    public async add(user: User): Promise<User> {
        await UserCreateValidator.validate(user)
        const userExist = await this._userRepository.checkExist(user)
        if (userExist) throw new ConflictException('User already has an account...')
        return this._userRepository.create(user)
    }

    /**
     * Get the data of all users in the infrastructure.
     *
     * @param query Defines object to be used for queries.
     * @return {Promise<Array<User>>}
     * @throws {RepositoryException}
     */
    public async getAll(query: IQuery): Promise<Array<User>> {
        return this._userRepository.find(query)
    }

    /**
     * Get in infrastructure the user data.
     *
     * @param id Unique identifier.
     * @param query Defines object to be used for queries.
     * @return {Promise<User>}
     * @throws {RepositoryException}
     */
    public async getById(id: string, query: IQuery): Promise<User> {
        query.filters = { _id: id }
        return this._userRepository.findOne(query)
    }

    /**
     * Update user data.
     *
     * @param user - User containing the data to be updated
     * @return {Promise<User>}
     * @throws {ConflictException | RepositoryException}
     */
    public async update(user: User): Promise<User> {
        await UserUpdateValidator.validate(user)
        return this._userRepository.update(user)
    }

    /**
     * Remove the user according to their unique identifier.
     *
     * @param id - Unique identifier.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    public async remove(id: string): Promise<boolean> {
        return this._userRepository.delete(id)
    }

    /**
     * Change the user password.
     *
     * @param id - Unique identifier.
     * @param old_password - Old user password.
     * @param new_password - New user password.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    public async changePassword(id: string, old_password: string, new_password: string): Promise<boolean> {
        await ChangePasswordValidator.validate(old_password, new_password)
        return this._userRepository.changePassword(id, old_password, new_password)
    }

    /**
     * Authenticate the user.
     *
     * @param email
     * @param password
     * @return {Promise<object>}
     * @throws {ValidationException | RepositoryException}
     */
    public async authenticate(email: string, password: string): Promise<object> {
        return this._userRepository.authenticate(email, password)
    }
}
