import { IRepository } from './repository.interface'
import { Patient } from '../domain/model/patient'
import { ValidationException } from '../domain/exception/validation.exception'
import { Goal } from '../domain/model/goal'

/**
 * Interface of the Patient repository.
 * Must be implemented by the user repository at the infrastructure layer.
 *
 * @see {@link HealthProfessionalRepository} for further information.
 * @extends {IRepository<Patient>}
 */
export interface IPatientRepository extends IRepository<Patient> {
    checkExists(users: Patient | Array<Patient>): Promise<boolean | ValidationException>

    /**
     * Updates a Patient goals.
     *
     * @param patientId - Id of patient to be updated.
     * @param goals - Goals to be inserted in the Patient.
     * @return {Promise<Patient>}
     * @throws {ValidationException | RepositoryException}
     */
    updateGoals(patientId: string, goals: Goal): Promise<Patient>

    /**
     * Updates a Patient fitbit_status.
     *
     * @param patientId - Id of patient to be updated.
     * @param fitbitStatus - New fitbit_status to be inserted in Patient.
     * @return {Promise<Patient>}
     * @throws {ValidationException | RepositoryException}
     */
    updateFitbitStatus(patientId: string, fitbitStatus: string): Promise<Patient>

    /**
     * Updates a Patient last_sync.
     *
     * @param patientId - Id of patient to be updated.
     * @param lastSync - New last_sync to be inserted in Patient.
     * @return {Promise<Patient>}
     * @throws {ValidationException | RepositoryException}
     */
    updateLastSync(patientId: string, lastSync: Date): Promise<Patient>
}
