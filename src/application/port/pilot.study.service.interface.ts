import { IService } from './service.interface'
import { PilotStudy } from '../domain/model/pilot.study'
import { IQuery } from './query.interface'
import { HealthProfessional } from '../domain/model/health.professional'

export interface IPilotStudyService extends IService<PilotStudy> {

    getAllHealthProfessionals(pilotId: string, query: IQuery): Promise<Array<HealthProfessional> | undefined>

    associateHealthProfessional(pilotId: string, healthId: string): Promise<Array<HealthProfessional> | undefined>

    disassociateHealthProfessional(pilotId: string, healthId: string): Promise<boolean | undefined>
}
