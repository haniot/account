import { IService } from './service.interface'
import { HealthProfessional } from '../domain/model/health.professional'
import { PilotStudy } from '../domain/model/pilot.study'

export interface IHealthProfessionalService extends IService<HealthProfessional> {
    getAllPilotStudies(item: HealthProfessional): Promise<Array<PilotStudy>>
}
