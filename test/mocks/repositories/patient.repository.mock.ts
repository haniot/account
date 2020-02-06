import { IPatientRepository } from '../../../src/application/port/patient.repository.interface'
import { DefaultEntityMock } from '../models/default.entity.mock'
import { IQuery } from '../../../src/application/port/query.interface'
import { Patient } from '../../../src/application/domain/model/patient'
import { AccessStatusTypes } from '../../../src/application/domain/utils/access.status.types'
import { Goal } from '../../../src/application/domain/model/goal'

const patient: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)
patient.id = DefaultEntityMock.PATIENT.id

export class PatientRepositoryMock implements IPatientRepository {
    public checkExists(item: Patient): Promise<boolean> {
        return Promise.resolve(item.id !== patient.id)
    }

    public count(): Promise<number> {
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

    public updateGoals(patientId: string, goals: Goal): Promise<Patient> {
        const patientGoals: Patient = new Patient()
        patientGoals.id = patientId
        patientGoals.goals = goals
        return Promise.resolve(patientGoals)
    }

    public updateFitbitStatus(patientId: string, fitbitStatus: string): Promise<Patient> {
        const patientFitbitStatus: Patient = new Patient()
        patientFitbitStatus.id = patientId
        switch (fitbitStatus) {
            case 'expired_token':
                patientFitbitStatus.external_services.fitbit_status = AccessStatusTypes.EXPIRED_TOKEN
                break
            case 'invalid_token':
                patientFitbitStatus.external_services.fitbit_status = AccessStatusTypes.INVALID_TOKEN
                break
            case 'invalid_refresh_token':
                patientFitbitStatus.external_services.fitbit_status = AccessStatusTypes.INVALID_REFRESH_TOKEN
                break
        }
        return Promise.resolve(patientFitbitStatus)
    }

    public updateLastSync(patientId: string, lastSync: Date): Promise<Patient> {
        const patientLastSync: Patient = new Patient()
        patientLastSync.id = patientId
        patientLastSync.external_services.fitbit_last_sync = lastSync
        patientLastSync.external_services.fitbit_status = AccessStatusTypes.VALID_TOKEN
        return Promise.resolve(patientLastSync)
    }
}
