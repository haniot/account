import { IAdminRepository } from '../../../src/application/port/admin.repository.interface'
import { IQuery } from '../../../src/application/port/query.interface'
import { Admin } from '../../../src/application/domain/model/admin'
import { DefaultEntityMock } from '../models/default.entity.mock'

const admin: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)
admin.id = DefaultEntityMock.ADMIN.id

export class AdminRepositoryMock implements IAdminRepository {

    public count(): Promise<number> {
        return Promise.resolve(1)
    }

    public create(item: Admin): Promise<Admin> {
        return Promise.resolve(admin)
    }

    public delete(id: string): Promise<boolean> {
        return Promise.resolve(true)
    }

    public find(query: IQuery): Promise<Array<Admin>> {
        return Promise.resolve([admin])
    }

    public findOne(query: IQuery): Promise<Admin> {
        return Promise.resolve(admin)
    }

    public update(item: Admin): Promise<Admin> {
        return Promise.resolve(admin)
    }

}
