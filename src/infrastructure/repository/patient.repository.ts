import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { Patient } from '../../application/domain/model/patient'
import { IPatientRepository } from '../../application/port/patient.repository.interface'
import { ValidationException } from '../../application/domain/exception/validation.exception'
import { Query } from './query/query'
import { UserType } from '../../application/domain/utils/user.type'
import { IUserRepository } from '../../application/port/user.repository.interface'
import { PatientEntity } from '../entity/patient.entity'
import { AccessStatusTypes } from '../../application/domain/utils/access.status.types'
import { Goal } from '../../application/domain/model/goal'

@injectable()
export class PatientRepository extends BaseRepository<Patient, PatientRepository> implements IPatientRepository {
    constructor(
        @inject(Identifier.USER_REPO_MODEL) readonly _userRepoModel: any,
        @inject(Identifier.PATIENT_ENTITY_MAPPER) readonly _patientEntityMapper: IEntityMapper<Patient, PatientRepository>,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
        @inject(Identifier.LOGGER) readonly _logger: any
    ) {
        super(_userRepoModel, _patientEntityMapper, _logger)
    }

    public create(item: Patient): Promise<Patient> {
        if (item.password) item.password = this._userRepository.encryptPassword(item.password)
        return super.create(item)
    }

    public checkExists(users: Patient | Array<Patient>): Promise<boolean | ValidationException> {
        const query: Query = new Query()
        return new Promise<boolean | ValidationException>((resolve, reject) => {
            if (users instanceof Array) {
                if (users.length === 0) return resolve(false)

                let count = 0
                const resultPatients: Array<string> = []

                users.forEach((patient: Patient) => {
                    if (patient.id) query.filters = { _id: patient.id }

                    query.addFilter({ type: UserType.PATIENT })

                    this.findOne(query)
                        .then(result => {
                            count++
                            if (!result && patient.id) resultPatients.push(patient.id)
                            if (count === users.length) {
                                if (resultPatients.length > 0) return resolve(new ValidationException(resultPatients.join(', ')))
                                return resolve(true)
                            }
                        }).catch(err => reject(super.mongoDBErrorListener(err)))
                })
            } else {
                if (users.id) query.addFilter({ _id: users.id })
                query.addFilter({ type: UserType.PATIENT })
                this.findOne(query)
                    .then(result => resolve(!!result))
                    .catch(err => reject(super.mongoDBErrorListener(err)))
            }
        })
    }

    public updateGoals(patientId: string, goals: Goal): Promise<Patient> {
        const goalsUp: any = {}
        if (goals.steps) goalsUp.steps = goals.steps
        if (goals.calories) goalsUp.calories = goals.calories
        if (goals.distance) goalsUp.distance = goals.distance
        if (goals.active_minutes) goalsUp.active_minutes = goals.active_minutes
        if (goals.sleep) goalsUp.sleep = goals.sleep
        return new Promise<Patient>((resolve, reject) => {
            this.Model.findOneAndUpdate({ _id: patientId },
                {'$set': { 'goals.steps': goalsUp.steps, 'goals.calories': goalsUp.calories,
                        'goals.distance': goalsUp.distance, 'goals.active_minutes': goalsUp.active_minutes,
                        'goals.sleep': goalsUp.sleep } },
                { new: true, omitUndefined: true })
                .exec()
                .then((result: PatientEntity) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public updateFitbitStatus(patientId: string, fitbitStatus: string): Promise<Patient> {
        return new Promise<Patient>((resolve, reject) => {
            this.Model.findOneAndUpdate({ _id: patientId },
                {'$set': { 'external_services.fitbit_status': fitbitStatus } }, { new: true })
                .exec()
                .then((result: PatientEntity) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public updateLastSync(patientId: string, lastSync: Date): Promise<Patient> {
        return new Promise<Patient>((resolve, reject) => {
            this.Model.findOneAndUpdate({ _id: patientId },
                {'$set':
                        {
                            'external_services.fitbit_last_sync': lastSync,
                            'external_services.fitbit_status': AccessStatusTypes.VALID_TOKEN
                        } },
                { new: true })
                .exec()
                .then((result: PatientEntity) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                })
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }
}
