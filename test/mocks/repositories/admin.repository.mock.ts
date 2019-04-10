import { IAdminRepository } from '../../../src/application/port/admin.repository.interface'
import { IQuery } from '../../../src/application/port/query.interface'
import { Admin } from '../../../src/application/domain/model/admin'
import { DefaultEntityMock } from '../models/default.entity.mock'

export class AdminRepositoryMock implements IAdminRepository {
    public count(query: IQuery): Promise<number> {
        return Promise.resolve(1)
    }

    public create(item: Admin): Promise<Admin> {
        return Promise.resolve(new Admin().fromJSON(DefaultEntityMock.ADMIN))
    }

    public delete(id: string): Promise<boolean> {
        return Promise.resolve(true)
    }

    public find(query: IQuery): Promise<Array<Admin>> {
        return Promise.resolve(new Array<Admin>(new Admin().fromJSON(DefaultEntityMock.ADMIN)))
    }

    public findOne(query: IQuery): Promise<Admin> {
        return Promise.resolve(new Admin().fromJSON(DefaultEntityMock.ADMIN))
    }

    public update(item: Admin): Promise<Admin> {
        return Promise.resolve(new Admin().fromJSON(DefaultEntityMock.ADMIN))
    }

}
