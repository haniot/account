import { inject, injectable } from 'inversify'
import { IUserService } from '../port/user.service.interface'
import { Identifier } from '../../di/identifiers'
import { IUserRepository } from '../port/user.repository.interface'
import { ChangePasswordValidator } from '../domain/validator/change.password.validator'
import { IQuery } from '../port/query.interface'
import { User } from '../domain/model/user'

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

    public add(item: User): Promise<User> {
        throw Error('Not implemented!')
    }

    public getAll(query: IQuery): Promise<Array<User>> {
        throw Error('Not implemented!')
    }

    public getById(id: string, query: IQuery): Promise<User> {
        throw Error('Not implemented!')
    }

    public update(item: User): Promise<User> {
        throw Error('Not implemented!')
    }
}
