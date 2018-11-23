import { IService } from './service.interface'
import { User } from '../domain/model/user'

/**
 * User service interface.
 *
 * @extends {IService}
 */
export interface IUserService extends IService<User> {

    /**
     * Change the user password.
     *
     * @param id - Unique identifier.
     * @param old_password - Old user password.
     * @param new_password - New user password.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    changePassword(id: string, old_password: string, new_password: string): Promise<boolean>

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
