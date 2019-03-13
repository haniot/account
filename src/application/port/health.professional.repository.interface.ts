import { IRepository } from './repository.interface'
import { HealthProfessional } from '../domain/model/health.professional'

/**
 * Interface of the Health Professional repository.
 * Must be implemented by the user repository at the infrastructure layer.
 *
 * @see {@link HealthProfessionalRepository} for further information.
 * @extends {IRepository<HealthProfessional>}
 */
export interface IHealthProfessionalRepository extends IRepository<HealthProfessional> {

}
