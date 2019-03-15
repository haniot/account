import { IRepository } from './repository.interface'
import { Admin } from '../domain/model/admin'

/**
 * Interface of the Health Professional repository.
 * Must be implemented by the user repository at the infrastructure layer.
 *
 * @see {@link HealthProfessionalRepository} for further information.
 * @extends {IRepository<HealthProfessional>}
 */
export interface IAdminRepository extends IRepository<Admin> {

}
