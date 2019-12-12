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
        if (item.type !== undefined) result.type = item.type
        if (item.scopes !== undefined) result.scopes = item.scopes
        if (item.name !== undefined) result.name = item.name
        if (item.email !== undefined) result.email = item.email
        if (item.password !== undefined) result.password = item.password
        if (item.change_password !== undefined) result.change_password = item.change_password
        if (item.email_verified !== undefined) result.email_verified = item.email_verified
        if (item.last_login !== undefined) result.last_login = item.last_login
        if (item.last_sync !== undefined) result.last_sync = item.last_sync
        if (item.birth_date !== undefined) result.birth_date = item.birth_date
        if (item.phone_number !== undefined) result.phone_number = item.phone_number
        if (item.selected_pilot_study !== undefined) result.selected_pilot_study = item.selected_pilot_study
        if (item.language !== undefined) result.language = item.language
        if (item.protected !== undefined) result.protected = item.protected

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
        if (json.type !== undefined) result.type = json.type
        if (json.scopes !== undefined) result.scopes = json.scopes
        if (json.name !== undefined) result.name = json.name
        if (json.email !== undefined) result.email = json.email
        if (json.password !== undefined) result.password = json.password
        if (json.change_password !== undefined) result.change_password = json.change_password
        if (json.email_verified !== undefined) result.email_verified = json.email_verified
        if (json.last_login !== undefined) result.last_login = json.last_login
        if (json.last_sync !== undefined) result.last_sync = json.last_sync
        if (json.birth_date !== undefined) result.birth_date = json.birth_date
        if (json.phone_number !== undefined) result.phone_number = json.phone_number
        if (json.selected_pilot_study !== undefined) result.selected_pilot_study = json.selected_pilot_study
        if (json.language !== undefined) result.language = json.language
        if (json.protected !== undefined) result.protected = json.protected

        return result
    }
}
