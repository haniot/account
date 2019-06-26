import { IRepository } from './repository.interface'
import { PilotStudy } from '../domain/model/pilot.study'
import { IQuery } from './query.interface'

export interface IPilotStudyRepository extends IRepository<PilotStudy> {
    findAndPopulate(query: IQuery): Promise<Array<PilotStudy>>

    findOneAndPopulate(query: IQuery): Promise<PilotStudy>

    checkExists(pilot: PilotStudy): Promise<boolean>

    associateUser(pilotId: string, userId: string, userType: string): Promise<PilotStudy>

    disassociateUser(pilotId: string, userId: string, userType: string): Promise<PilotStudy>
}
