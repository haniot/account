import { IEntityMapper } from '../../port/entity.mapper.interface'
import { PilotStudyEntity } from '../pilot.study.entity'
import { PilotStudy } from '../../../application/domain/model/pilot.study'
import { HealthProfessional } from '../../../application/domain/model/health.professional'
import { injectable } from 'inversify'
import { Patient } from '../../../application/domain/model/patient'

@injectable()
export class PilotStudyEntityMapper implements IEntityMapper <PilotStudy, PilotStudyEntity> {
    public jsonToModel(json: any): PilotStudy {
        const result: PilotStudy = new PilotStudy()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.created_at !== undefined) result.created_at = json.created_at
        if (json.name !== undefined) result.name = json.name
        if (json.is_active !== undefined) result.is_active = json.is_active
        if (json.start !== undefined) result.start = json.start
        if (json.end !== undefined) result.end = json.end
        if (json.health_professionals instanceof Array) {
            result.health_professionals = json.health_professionals.map(item => new HealthProfessional().fromJSON(item))
        }
        if (json.patients instanceof Array) {
            result.patients = json.patients.map(item => {
                const patientItem = new Patient().fromJSON(item)
                patientItem.created_at = item.created_at
                patientItem.last_login = item.last_login
                patientItem.external_services = item.external_services
                return patientItem
            })
        }
        if (json.location !== undefined) result.location = json.location
        if (json.data_types !== undefined) result.data_types = json.data_types

        return result
    }

    public modelEntityToModel(item: PilotStudyEntity): PilotStudy {
        throw Error('Not implemented!')
    }

    public modelToModelEntity(item: PilotStudy): PilotStudyEntity {
        const result: PilotStudyEntity = new PilotStudyEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.name !== undefined) result.name = item.name
        if (item.is_active !== undefined) result.is_active = item.is_active
        if (item.start !== undefined) result.start = item.start
        if (item.end !== undefined) result.end = item.end
        if (item.health_professionals !== undefined && item.health_professionals instanceof Array) {
            result.health_professionals = item.health_professionals.map(value => value.id)
        }
        if (item.patients !== undefined && item.patients instanceof Array) {
            result.patients = item.patients.map(value => value.id)
        }
        if (item.location !== undefined) result.location = item.location
        if (item.data_types !== undefined) result.data_types = item.data_types

        return result
    }

    public transform(item: any): any {
        if (item instanceof PilotStudy) return this.modelToModelEntity(item)
        return this.jsonToModel(item)
    }

}
