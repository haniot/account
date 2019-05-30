import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IQuery } from '../port/query.interface'
import { UserType } from '../domain/utils/user.type'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { IPatientService } from '../port/patient.service.interface'
import { IPatientRepository } from '../port/patient.repository.interface'
import { CreatePatientValidator } from '../domain/validator/create.patient.validator'
import { Patient } from '../domain/model/patient'
import { UpdatePatientValidator } from '../domain/validator/update.patient.validator'
import { IPilotStudyRepository } from '../port/pilot.study.repository.interface'
import { PilotStudy } from '../domain/model/pilot.study'
import { ValidationException } from '../domain/exception/validation.exception'
import { Strings } from '../../utils/strings'
import { IUserRepository } from '../port/user.repository.interface'
import { ConflictException } from '../domain/exception/conflict.exception'

@injectable()
export class PatientService implements IPatientService {
    constructor(
        @inject(Identifier.PATIENT_REPOSITORY) private readonly _patientRepository: IPatientRepository,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
        @inject(Identifier.PILOT_STUDY_REPOSITORY) private readonly _pilotStudyRepository: IPilotStudyRepository) {
    }

    public async add(item: Patient): Promise<Patient> {
        try {
            CreatePatientValidator.validate(item)
            if (item.pilotstudy_id) {
                const pilotExists =
                    await this._pilotStudyRepository.checkExists(new PilotStudy().fromJSON(item.pilotstudy_id))
                if (!pilotExists) throw new ValidationException(Strings.PILOT_STUDY.ASSOCIATION_FAILURE)
                if (item.email) {
                    const patientExists = await this._userRepository.checkExist(item.email)
                    if (patientExists) throw new ConflictException(Strings.USER.EMAIL_ALREADY_REGISTERED)
                }
            }
            return this._patientRepository.create(item)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public getAll(query: IQuery): Promise<Array<Patient>> {
        query.addFilter({ type: UserType.PATIENT })
        return this._patientRepository.find(query)
    }

    public getById(id: string, query: IQuery): Promise<Patient> {
        try {
            ObjectIdValidator.validate(id)
            query.addFilter({ _id: id, type: UserType.PATIENT })
            return this._patientRepository.findOne(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public remove(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id)
            return this._patientRepository.delete(id)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async update(item: Patient): Promise<Patient> {
        try {
            UpdatePatientValidator.validate(item)
            return this._patientRepository.update(item)
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
