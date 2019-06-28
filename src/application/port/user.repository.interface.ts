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

    countAdmins(): Promise<number>

    countPatients(): Promise<number>

    countHealthProfessionals(): Promise<number>
}
