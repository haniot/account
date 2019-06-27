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
import { Strings } from '../../utils/strings'
import { IUserRepository } from '../port/user.repository.interface'
import { ConflictException } from '../domain/exception/conflict.exception'

@injectable()
export class PatientService implements IPatientService {
    constructor(
        @inject(Identifier.PATIENT_REPOSITORY) private readonly _patientRepository: IPatientRepository,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository) {
    }

    public async add(item: Patient): Promise<Patient> {
        try {
            CreatePatientValidator.validate(item)
            const exists = await this._userRepository.checkExist(item.email)
            if (exists) throw new ConflictException(Strings.USER.EMAIL_ALREADY_REGISTERED)
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
            item.last_login = undefined
            return this._patientRepository.update(item)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public count(query: IQuery): Promise<number> {
        query.addFilter({ type: UserType.PATIENT })
        return this._patientRepository.count(query)
    }
}
