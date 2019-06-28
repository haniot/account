import { User } from '../domain/model/user'

/**
 * Interface of the auth repository.
 * Must be implemented by the user repository at the infrastructure layer.
 */
export interface IAuthRepository {
    /**
     * Authenticate the user.
     *
     * @param userMail
     * @param password
     * @return {Promise<object>}
     * @throws {ValidationException | RepositoryException}
     */
    authenticate(userMail: string, password: string): Promise<object>

    /**
     * Generate Access Token by user data.
     *
     * @param user
     * @return {Promise<string>}
     * @throws {ValidationException | RepositoryException}
     */
    generateAccessToken(user: User): Promise<string>

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
