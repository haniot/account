import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { AdminEntity } from '../entity/admin.entity'
import { Admin } from '../../application/domain/model/admin'
import { Identifier } from '../../di/identifiers'
import { IAdminRepository } from '../../application/port/admin.repository.interface'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { IAuthRepository } from '../../application/port/auth.repository.interface'
import { Query } from './query/query'
import { UserType } from '../../application/domain/utils/user.type'

@injectable()
export class AdminRepository extends BaseRepository<Admin, AdminEntity> implements IAdminRepository {
    constructor(
        @inject(Identifier.USER_REPO_MODEL) readonly _adminModel: any,
        @inject(Identifier.ADMIN_ENTITY_MAPPER) readonly _adminEntityMapper: IEntityMapper<Admin, AdminEntity>,
        @inject(Identifier.AUTH_REPOSITORY) private readonly _authRepository: IAuthRepository,
        @inject(Identifier.LOGGER) readonly _logger: any
    ) {
        super(_adminModel, _adminEntityMapper, _logger)
    }

    public create(item: Admin): Promise<Admin> {
        if (item.password) item.password = this._authRepository.encryptPassword(item.password)
        return super.create(item)
    }

    public count(): Promise<number> {
        return super.count(new Query().fromJSON({ filters: { type: UserType.ADMIN } }))
    }
}
