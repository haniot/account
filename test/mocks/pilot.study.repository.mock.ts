import { IPilotStudyRepository } from '../../src/application/port/pilot.study.repository.interface'
import { PilotStudy } from '../../src/application/domain/model/pilot.study'
import { IQuery } from '../../src/application/port/query.interface'
import { ValidationException } from '../../src/application/domain/exception/validation.exception'
import { DefaultEntityMock } from './default.entity.mock'

export class PilotStudyRepositoryMock implements IPilotStudyRepository {
    public checkExists(pilotStudies: PilotStudy | Array<PilotStudy>): Promise<boolean | ValidationException> {
        if (pilotStudies instanceof Array) {
            return Promise.resolve(pilotStudies[0].name === 'exists')
        }
        return Promise.resolve(pilotStudies.name === 'exists')
    }

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
}
