import { inject, injectable } from 'inversify'
import { IGoalService } from '../port/goal.service.interface'
import { IQuery } from '../port/query.interface'
import { Goal } from '../domain/model/goal'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { UserType } from '../domain/utils/user.type'
import { Identifier } from '../../di/identifiers'
import { IPatientRepository } from '../port/patient.repository.interface'
import { Patient } from '../domain/model/patient'
import { ValidationException } from '../domain/exception/validation.exception'
import { Strings } from '../../utils/strings'
import { GoalValidator } from '../domain/validator/goal.validator'

@injectable()
export class GoalService implements IGoalService {
    constructor(
        @inject(Identifier.PATIENT_REPOSITORY) private readonly _patientRepository: IPatientRepository,
    ) {
    }

    /**
     * Retrieves a Goal object from a Patient user by its id.
     *
     * @param patientId Patient id.
     * @param query Defines object to be used for queries.
     * @return {Promise<Goal>}
     * @throws {ValidationException | RepositoryException}
     */
    public async getFromPatient(patientId: string, query: IQuery): Promise<Goal> {
        try {
            ObjectIdValidator.validate(patientId)
            query.addFilter({ _id: patientId, type: UserType.PATIENT })
            const patient: Patient = await this._patientRepository.findOne(query)

            if (!patient) throw new ValidationException(Strings.PATIENT.NOT_FOUND, Strings.PATIENT.NOT_FOUND_DESCRIPTION)

            return Promise.resolve(patient.goals)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async add(item: Goal): Promise<Goal> {
        throw new Error('Unsupported feature!')
    }

    public async getAll(query: IQuery): Promise<Array<Goal>> {
        throw new Error('Unsupported feature!')
    }

    public async getById(id: string, query: IQuery): Promise<Goal> {
        throw new Error('Unsupported feature!')
    }

    public async remove(id: string): Promise<boolean> {
        throw new Error('Unsupported feature!')
    }

    public async update(item: Goal): Promise<Goal> {
        throw new Error('Unsupported feature!')
    }

    public async count(query: IQuery): Promise<number> {
        throw new Error('Unsupported feature!')
    }

    public async updateFromPatient(patientId: string, goals: Goal): Promise<Goal> {
        try {
            ObjectIdValidator.validate(patientId)
            GoalValidator.validate(goals)
            const patientUpdated: Patient = await this._patientRepository.updateGoals(patientId, goals)

            if (!patientUpdated) throw new ValidationException(Strings.PATIENT.NOT_FOUND, Strings.PATIENT.NOT_FOUND_DESCRIPTION)

            return Promise.resolve(patientUpdated.goals)
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
