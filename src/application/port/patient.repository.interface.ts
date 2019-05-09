import { IRepository } from './repository.interface'
import { Patient } from '../domain/model/patient'

/**
 * Interface of the Patient repository.
 * Must be implemented by the user repository at the infrastructure layer.
 *
 * @see {@link HealthProfessionalRepository} for further information.
 * @extends {IRepository<Patient>}
 */
export interface IPatientRepository extends IRepository<Patient> {
}