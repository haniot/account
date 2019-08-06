import { inject, injectable } from 'inversify'
import { IUserService } from '../port/user.service.interface'
import { Identifier } from '../../di/identifiers'
import { IUserRepository } from '../port/user.repository.interface'
import { IQuery } from '../port/query.interface'
import { User } from '../domain/model/user'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { IPilotStudyRepository } from '../port/pilot.study.repository.interface'
import { Query } from '../../infrastructure/repository/query/query'
import { PilotStudy } from '../domain/model/pilot.study'
import { UserType } from '../domain/utils/user.type'
import { ChangePasswordValidator } from '../domain/validator/change.password.validator'

/**
 * Implementing User Service.
 *
 * @implements {IUserService}
 */
@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
        @inject(Identifier.PILOT_STUDY_REPOSITORY) private readonly _pilotStudyRepository: IPilotStudyRepository) {
    }

    /**
     * Remove the user according to their unique identifier.
     *
     * @param id - Unique identifier.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    public async remove(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id)
            const user: User = await this._userRepository.findOne(new Query().fromJSON({ filters: { _id: id } }))
            const result: boolean = await this._userRepository.delete(id)
            if (user && user.type !== UserType.ADMIN) {
                const query: Query = new Query()
                query.addFilter(user.type === UserType.PATIENT ? { patients: user.id } : { health_professionals: user.id })
                const pilots: Array<PilotStudy> = await this._pilotStudyRepository.find(query)

                await pilots.forEach(async pilot => {
                    await this._pilotStudyRepository.disassociateUser(pilot.id!, user.id!, user.type!)
                })
            }
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /**
     * Change the user password.
     *
     * @param email - Email of user
     * @param old_password - Old user password.
     * @param new_password - New user password.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    public async changePassword(email: string, old_password: string, new_password: string): Promise<boolean> {
        try {
            ChangePasswordValidator.validate(email, old_password, new_password)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._userRepository.changePassword(email, old_password, new_password)
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
