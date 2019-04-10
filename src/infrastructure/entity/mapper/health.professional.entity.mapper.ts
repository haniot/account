import { injectable } from 'inversify'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { HealthProfessional } from '../../../application/domain/model/health.professional'
import { HealthProfessionalEntity } from '../health.professional.entity'

@injectable()
export class HealthProfessionalEntityMapper implements IEntityMapper<HealthProfessional, HealthProfessionalEntity> {
    public transform(item: any): any {
        if (item instanceof HealthProfessional) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }

    /**
     * Convert {HealthProfessional} for {HealthProfessionalEntity}.
     *
     * @see Creation Date should not be mapped to the type the repository understands.
     * Because this attribute is created automatically by the database.
     * Therefore, if a null value is passed at update time, an exception is thrown.
     * @param item
     */
    public modelToModelEntity(item: HealthProfessional): HealthProfessionalEntity {
        const result: HealthProfessionalEntity = new HealthProfessionalEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.password !== undefined) result.password = item.password
        if (item.type !== undefined) result.type = item.type
        if (item.scopes !== undefined) result.scopes = item.scopes
        if (item.email !== undefined) result.email = item.email
        if (item.name !== undefined) result.name = item.name
        if (item.health_area !== undefined) result.health_area = item.health_area
        if (item.change_password !== undefined) result.change_password = item.change_password

        return result
    }

    /**
     * Convert {HealthProfessionalEntity} for {HealthProfessional}.
     *
     * @see Each attribute must be mapped only if it contains an assigned value,
     * because at some point the attribute accessed may not exist.
     * @param item
     */
    public modelEntityToModel(item: HealthProfessionalEntity): HealthProfessional {
        throw Error('Not implemented!')
    }

    /**
     * Convert JSON for {HealthProfessional}.
     *
     * @see Each attribute must be mapped only if it contains an assigned value,
     * because at some point the attribute accessed may not exist.
     * @param json
     */
    public jsonToModel(json: any): HealthProfessional {
        const result: HealthProfessional = new HealthProfessional()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.password !== undefined) result.password = json.password
        if (json.type !== undefined) result.type = json.type
        if (json.scopes !== undefined) result.scopes = json.scopes
        if (json.email !== undefined) result.email = json.email
        if (json.name !== undefined) result.name = json.name
        if (json.health_area !== undefined) result.health_area = json.health_area
        if (json.change_password !== undefined) result.change_password = json.change_password

        return result
    }

}
