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
    }
