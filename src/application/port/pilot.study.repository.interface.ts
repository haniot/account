import { IRepository } from './repository.interface'
import { PilotStudy } from '../domain/model/pilot.study'
import { IQuery } from './query.interface'

export interface IPilotStudyRepository extends IRepository<PilotStudy> {
    findAndPopulate(query: IQuery): Promise<Array<PilotStudy>>

    findOneAndPopulate(query: IQuery): Promise<PilotStudy>

    checkExists(pilot: PilotStudy): Promise<boolean>

    associateUser(pilotId: string, userId: string, userType: string): Promise<PilotStudy>

    disassociateUser(pilotId: string, userId: string, userType: string): Promise<PilotStudy>

    countHealthProfessionalsFromPilotStudy(pilotId: string): Promise<number>

    countPatientsFromPilotStudy(pilotId: string): Promise<number>

    countPilotStudiesFromPatient(patientId: string): Promise<number>

    countPilotStudiesFromHealthProfessional(healthId: string): Promise<number>

    countPatientsFromHealthProfessional(healthId: string): Promise<number>
}
