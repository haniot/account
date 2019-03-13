import { IRepository } from './repository.interface'
import { IQuery } from './query.interface'
import { User } from '../domain/model/user'

/**
 * Interface of the user repository.
 * Must be implemented by the user repository at the infrastructure layer.
 *
 * @see {@link UserRepository} for further information.
 * @extends {IRepository<User>}
 */
export interface IUserRepository extends IRepository<User> {
    /**
     * Retrieves the user by your email.
     *
     * @param user User username.
     * @param query Defines object to be used for queries.
     * @return {Promise<User>}
     * @throws {RepositoryException}
     */
    getByUsername(user: string, query: IQuery): Promise<User>

    /**
     * Checks if an user already has a registration.
     * What differs one user to another is your email.
     *
     * @param user
     * @return {Promise<boolean>} True if it exists or False, otherwise.
     * @throws {ValidationException | RepositoryException}
     */
    checkExist(user: User): Promise<boolean>

    /**
     * Change the user password.
     *
     * @param id
     * @param old_password
     * @param new_password
     * @return {Promise<boolean>} True if the password was changed or False, otherwise.
     * @throws {ValidationException | RepositoryException}
     */
    changePassword(id: string, old_password: string, new_password: string): Promise<boolean>

    /**
     * Encrypt the user password
     *
     * @param password
     * @return {string} Encrypted password if the encrypt was successfully.
     */
    encryptPassword(password: string): string

    /**
     * Compare if two passwords match.,
     *
     * @param password_one
     * @param password_two
     * @return True if the passwords matches, false otherwise.
     */
    comparePasswords(password_one: string, password_two: string): boolean
}
