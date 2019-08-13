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

    resetPassword(_email: string): Promise<User>

    updatePassword(userId: string, userEmail: string, new_password: string, token: string): Promise<User>

    validateToken(token: string): Promise<boolean>

    getTokenPayload(token: string): Promise<any>
}
