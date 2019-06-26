import { IPilotStudyRepository } from '../../../src/application/port/pilot.study.repository.interface'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { IQuery } from '../../../src/application/port/query.interface'
import { DefaultEntityMock } from '../models/default.entity.mock'

export class PilotStudyRepositoryMock implements IPilotStudyRepository {

    public count(query: IQuery): Promise<number> {
        return Promise.resolve(1)
    }

    public create(item: PilotStudy): Promise<PilotStudy> {
        return Promise.resolve(new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY))
    }

    public delete(id: string): Promise<boolean> {
        return Promise.resolve(id === DefaultEntityMock.PILOT_STUDY.id)
    }

    public find(query: IQuery): Promise<Array<PilotStudy>> {
        return Promise.resolve(new Array<PilotStudy>(new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)))
    }

    public findOne(query: IQuery): Promise<PilotStudy> {
        return Promise.resolve(new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY))
    }

    public update(item: PilotStudy): Promise<PilotStudy> {
        return Promise.resolve(new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY))
    }

    public associateUser(pilotId: string, userId: string, userType: string): Promise<PilotStudy> {
        return Promise.resolve(new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY))
    }

    public checkExists(pilot: PilotStudy): Promise<boolean> {
        return Promise.resolve(true)
    }

    public disassociateUser(pilotId: string, userId: string, userType: string): Promise<PilotStudy> {
        return Promise.resolve(new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY))

    }

    public findAndPopulate(query: IQuery): Promise<Array<PilotStudy>> {
        return Promise.resolve([new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)])
    }

    public findOneAndPopulate(query: IQuery): Promise<PilotStudy> {
        return Promise.resolve(new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY))
    }
}
