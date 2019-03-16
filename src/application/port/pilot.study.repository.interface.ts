import { IRepository } from './repository.interface'
import { PilotStudy } from '../domain/model/pilot.study'
import { ValidationException } from '../domain/exception/validation.exception'

export interface IPilotStudyRepository extends IRepository<PilotStudy> {
    checkExists(pilotStudies: PilotStudy | Array<PilotStudy>): Promise<boolean | ValidationException>
}
