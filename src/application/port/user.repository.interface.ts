import { IRepository } from './repository.interface'
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
     * Checks if an user already has a registration with email.
     * What differs one user to another is your email.
     *
     * @param userEmail
     *
     * @return {Promise<boolean>} True if it exists or False, otherwise.
     * @throws {ValidationException | RepositoryException}
     */
    checkExist(userEmail?: string): Promise<boolean>

    /**
     * Change the user password.
     *
     * @param userEmail
     * @param oldPassword
     * @param newPassword
     * @return {Promise<boolean>} True if the password was changed or False, otherwise.
     * @throws {ValidationException | RepositoryException}
     */
    changePassword(userEmail: string, oldPassword: string, newPassword: string): Promise<boolean>

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
     * @param passwordOne
     * @param passwordTwo
     * @return True if the passwords matches, false otherwise.
     */
    comparePasswords(passwordOne: string, passwordTwo: string): boolean
}
