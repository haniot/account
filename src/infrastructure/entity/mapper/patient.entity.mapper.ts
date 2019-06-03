import { IEntityMapper } from '../../port/entity.mapper.interface'
import { PatientEntity } from '../patient.entity'
import { Patient } from '../../../application/domain/model/patient'
import { injectable } from 'inversify'

@injectable()
export class PatientEntityMapper implements IEntityMapper<Patient, PatientEntity> {
    public transform(item: any): any {
        if (item instanceof Patient) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }

    public jsonToModel(json: any): Patient {
        const result: Patient = new Patient()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.password !== undefined) result.password = json.password
        if (json.type !== undefined) result.type = json.type
        if (json.scopes !== undefined) result.scopes = json.scopes
        if (json.email !== undefined) result.email = json.email
        if (json.change_password !== undefined) result.change_password = json.change_password
        if (json.name !== undefined) result.name = json.name
        if (json.gender !== undefined) result.gender = json.gender
        if (json.birth_date !== undefined) result.birth_date = json.birth_date
        if (json.pilotstudy_id !== undefined) result.pilotstudy_id = json.pilotstudy_id

        return result
    }

    public modelEntityToModel(item: PatientEntity): Patient {
        throw Error('Not implemented!')
    }

    public modelToModelEntity(item: Patient): PatientEntity {
        const result: PatientEntity = new PatientEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.password !== undefined) result.password = item.password
        if (item.type !== undefined) result.type = item.type
        if (item.scopes !== undefined) result.scopes = item.scopes
        if (item.email !== undefined) result.email = item.email
        if (item.change_password !== undefined) result.change_password = item.change_password
        if (item.name !== undefined) result.name = item.name
        if (item.gender !== undefined) result.gender = item.gender
        if (item.birth_date !== undefined) result.birth_date = item.birth_date
        if (item.pilotstudy_id !== undefined) result.pilotstudy_id = item.pilotstudy_id

        return result
    }
}
