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
}
