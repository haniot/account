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
        if (json.created_at !== undefined) result.created_at = json.created_at
        if (json.type !== undefined) result.type = json.type
        if (json.scopes !== undefined) result.scopes = json.scopes
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

        if (json.name !== undefined) result.name = json.name
        if (json.gender !== undefined) result.gender = json.gender
        if (json.goals !== undefined) {
            if (json.goals.steps !== undefined) result.goals.steps = json.goals.steps
            if (json.goals.calories !== undefined) result.goals.calories = json.goals.calories
            if (json.goals.distance !== undefined) result.goals.distance = json.goals.distance
            if (json.goals.active_minutes !== undefined) result.goals.active_minutes = json.goals.active_minutes
            if (json.goals.sleep !== undefined) result.goals.sleep = json.goals.sleep
        }
        if (json.external_services !== undefined) {
            if (json.external_services.fitbit_status !== undefined)
                result.external_services.fitbit_status = json.external_services.fitbit_status
            if (json.external_services.fitbit_last_sync !== undefined)
                result.external_services.fitbit_last_sync = json.external_services.fitbit_last_sync
        }
        return result
    }

    public modelEntityToModel(item: PatientEntity): Patient {
        throw Error('Not implemented!')
    }

    public modelToModelEntity(item: Patient): PatientEntity {
        const result: PatientEntity = new PatientEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.type !== undefined) result.type = item.type
        if (item.scopes !== undefined) result.scopes = item.scopes
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

        if (item.name !== undefined) result.name = item.name
        if (item.gender !== undefined) result.gender = item.gender
        if (item.goals !== undefined) result.goals = item.goals.toJSON()
        if (item.external_services !== undefined) result.external_services = item.external_services.toJSON()

        return result
    }
}
