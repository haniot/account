import { IHealthProfessionalRepository } from '../../src/application/port/health.professional.repository.interface'
import { IQuery } from '../../src/application/port/query.interface'
import { HealthProfessional } from '../../src/application/domain/model/health.professional'
import { ValidationException } from '../../src/application/domain/exception/validation.exception'
import { DefaultEntityMock } from './default.entity.mock'

export class HealthProfessionalRepositoryMock implements IHealthProfessionalRepository {
    public checkExists(users: HealthProfessional | Array<HealthProfessional>): Promise<boolean | ValidationException> {
        if (users instanceof Array)
            return Promise.resolve(users[0].email === 'exists')
        return Promise.resolve(users.email === 'exists')
    }

    public count(query: IQuery): Promise<number> {
        return Promise.resolve(1)
    }

    public create(item: HealthProfessional): Promise<HealthProfessional> {
        return Promise.resolve(new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL))
    }

    public delete(id: string): Promise<boolean> {
        return Promise.resolve(id === DefaultEntityMock.HEALTH_PROFESSIONAL.id)
    }

    public find(query: IQuery): Promise<Array<HealthProfessional>> {
        return Promise.resolve(
            new Array<HealthProfessional>(new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)))

    }

    public findOne(query: IQuery): Promise<HealthProfessional> {
        return Promise.resolve(new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL))
    }

    public update(item: HealthProfessional): Promise<HealthProfessional> {
        return Promise.resolve(new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL))
    }
}
