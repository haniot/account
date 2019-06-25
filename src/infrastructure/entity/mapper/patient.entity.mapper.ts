import { IEntityMapper } from '../../port/entity.mapper.interface'
import { PatientEntity } from '../patient.entity'
import { Patient } from '../../../application/domain/model/patient'
import { injectable } from 'inversify'
import { PilotStudy } from '../../../application/domain/model/pilot.study'

@injectable()
export class PatientEntityMapper implements IEntityMapper<Patient, PatientEntity> {
    public transform(item: any): any {
        if (item instanceof Patient) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }

    public jsonToModel(json: any): Patient {
        const result: Patient = new Patient()
        if (!json) return result

        if (json.type !== undefined) result.type = json.type
        if (json.scopes !== undefined) result.scopes = json.scopes
        if (json.change_password !== undefined) result.change_password = json.change_password
        if (json.email_verified !== undefined) result.email_verified = json.email_verified
        if (json.id !== undefined) result.id = json.id
        if (json.name !== undefined) result.name = json.name
        if (json.birth_date !== undefined) result.birth_date = json.birth_date
        if (json.gender !== undefined) result.gender = json.gender
        if (json.email !== undefined) result.email = json.email
        if (json.password !== undefined) result.password = json.password
        if (json.phone_number !== undefined) result.phone_number = json.phone_number
        if (json.pilot_studies !== undefined && json.pilot_studies instanceof Array) {
            result.pilot_studies = json.pilot_studies.map(item => new PilotStudy().fromJSON(item))
        }

        return result
    }

    public modelEntityToModel(item: PatientEntity): Patient {
        throw Error('Not implemented!')
    }

    public modelToModelEntity(item: Patient): PatientEntity {
        const result: PatientEntity = new PatientEntity()

        if (item.type !== undefined) result.type = item.type
        if (item.scopes !== undefined) result.scopes = item.scopes
        if (item.change_password !== undefined) result.change_password = item.change_password
        if (item.email_verified !== undefined) result.email_verified = item.email_verified
        if (item.id !== undefined) result.id = item.id
        if (item.name !== undefined) result.name = item.name
        if (item.birth_date !== undefined) result.birth_date = item.birth_date
        if (item.gender !== undefined) result.gender = item.gender
        if (item.email !== undefined) result.email = item.email
        if (item.password !== undefined) result.password = item.password
        if (item.phone_number !== undefined) result.phone_number = item.phone_number
        if (item.pilot_studies !== undefined && item.pilot_studies.length > 0) {
            result.pilot_studies = item.pilot_studies.map(value => value.toJSON())
        }

        return result
    }
}
