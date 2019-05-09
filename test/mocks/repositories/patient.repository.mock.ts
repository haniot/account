import { IPatientRepository } from '../../../src/application/port/patient.repository.interface'
import { DefaultEntityMock } from '../models/default.entity.mock'
import { IQuery } from '../../../src/application/port/query.interface'
import { Patient } from '../../../src/application/domain/model/patient'

const patient: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)
patient.id = DefaultEntityMock.PATIENT.id

export class PatientRepositoryMock implements IPatientRepository {
    public checkExists(id: string): Promise<boolean> {
        return Promise.resolve(id === patient.id)
    }

    public count(query: IQuery): Promise<number> {
        return Promise.resolve(1)
    }

    public create(item: Patient): Promise<Patient> {
        return Promise.resolve(patient)
    }

    public delete(id: string): Promise<boolean> {
        return Promise.resolve(id === patient.id)
    }

    public find(query: IQuery): Promise<Array<Patient>> {
        return Promise.resolve([patient])
    }

    public findOne(query: IQuery): Promise<Patient> {
        return Promise.resolve(patient)
    }

    public update(item: Patient): Promise<Patient> {
        return Promise.resolve(patient)
    }

}
