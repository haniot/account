import { injectable } from 'inversify'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { Admin } from '../../../application/domain/model/admin'
import { AdminEntity } from '../admin.entity'

@injectable()
export class AdminEntityMapper implements IEntityMapper<Admin, AdminEntity> {
    public transform(item: any): any {
        if (item instanceof Admin) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }

    /**
     * Convert {Admin} for {AdminEntity}.
     *
     * @see Creation Date should not be mapped to the type the repository understands.
     * Because this attribute is created automatically by the database.
     * Therefore, if a null value is passed at update time, an exception is thrown.
     * @param item
     */
    public modelToModelEntity(item: Admin): AdminEntity {
        const result: AdminEntity = new AdminEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.password !== undefined) result.password = item.password
        if (item.type !== undefined) result.type = item.type
        if (item.scopes !== undefined) result.scopes = item.scopes
        if (item.email !== undefined) result.email = item.email
        if (item.change_password !== undefined) result.change_password = item.change_password

        return result
    }

    /**
     * Convert {AdminEntity} for {Admin}.
     *
     * @see Each attribute must be mapped only if it contains an assigned value,
     * because at some point the attribute accessed may not exist.
     * @param item
     */
    public modelEntityToModel(item: AdminEntity): Admin {
        throw Error('Not implemented!')
    }

    /**
     * Convert JSON for {Admin}.
     *
     * @see Each attribute must be mapped only if it contains an assigned value,
     * because at some point the attribute accessed may not exist.
     * @param json
     */
    public jsonToModel(json: any): Admin {
        const result: Admin = new Admin()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.password !== undefined) result.password = json.password
        if (json.type !== undefined) result.type = json.type
        if (json.scopes !== undefined) result.scopes = json.scopes
        if (json.email) result.email = json.email
        if (json.change_password !== undefined) result.change_password = json.change_password

        return result
    }
}
