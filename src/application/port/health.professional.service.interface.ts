import { IService } from './service.interface'
import { HealthProfessional } from '../domain/model/health.professional'
import { PilotStudy } from '../domain/model/pilot.study'
import { IQuery } from './query.interface'

export interface IHealthProfessionalService extends IService<HealthProfessional> {
    getAllPilotStudies(healthProfessionalId: string, query: IQuery): Promise<Array<PilotStudy> | undefined>
}
