import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { Identifier } from '../../di/identifiers'
import { IUserRepository } from '../../application/port/user.repository.interface'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { Patient } from '../../application/domain/model/patient'
import { IPatientRepository } from '../../application/port/patient.repository.interface'

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
}
