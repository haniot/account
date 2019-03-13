import { IAdminService } from '../port/admin.service.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IAdminRepository } from '../port/admin.repository.interface'
import { IQuery } from '../port/query.interface'
import { Admin } from '../domain/model/admin'
import { CreateAdminValidator } from '../domain/validator/create.admin.validator'
import { UserType } from '../domain/utils/user.type'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { UpdateAdminValidator } from '../domain/validator/update.admin.validator'

@injectable()
export class AdminService implements IAdminService {
    constructor(
        @inject(Identifier.ADMIN_REPOSITORY) private readonly _adminRepository: IAdminRepository
    ) {
    }

    public add(item: Admin): Promise<Admin> {
        try {
            CreateAdminValidator.validate(item)
        } catch (err) {
            return Promise.reject(err)
        }

        return this._adminRepository.create(item)
    }

    public getAll(query: IQuery): Promise<Array<Admin>> {
        query.addFilter({ type: UserType.ADMIN })
        return this._adminRepository.find(query)
    }

    public getById(id: string, query: IQuery): Promise<Admin> {
        try {
            ObjectIdValidator.validate(id)
        } catch (err) {
            return Promise.reject(err)
        }
        query.addFilter({ _id: id, type: UserType.ADMIN })
        return this._adminRepository.findOne(query)
    }

    public remove(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._adminRepository.delete(id)
    }

    public update(item: Admin): Promise<Admin> {
        try {
            UpdateAdminValidator.validate(item)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._adminRepository.update(item)
    }
}
