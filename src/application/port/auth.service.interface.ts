/**
 * Auth service interface.
 */
export interface IAuthService {
    /**
     * Authenticate the user.
     *
     * @param email
     * @param password
     * @return {Promise<object>}
     * @throws {ValidationException | RepositoryException}
     */
    authenticate(email: string, password: string): Promise<object>

    forgotPassword(email: string): Promise<object>

    changePassword(email: string, old_password: string, new_password: string, token: string): Promise<boolean>
}
