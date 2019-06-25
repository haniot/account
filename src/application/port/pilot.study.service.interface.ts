import { IService } from './service.interface'
import { PilotStudy } from '../domain/model/pilot.study'
import { IQuery } from './query.interface'
import { HealthProfessional } from '../domain/model/health.professional'
import { Patient } from '../domain/model/patient'

export interface IPilotStudyService extends IService<PilotStudy> {

    getAllHealthProfessionals(pilotId: string, query: IQuery): Promise<Array<HealthProfessional>>

    getAllPatients(pilotId: string, query: IQuery): Promise<Array<Patient>>

    associateHealthProfessional(pilotId: string, healthId: string): Promise<Array<HealthProfessional>>

    disassociateHealthProfessional(pilotId: string, healthId: string): Promise<boolean >
}
