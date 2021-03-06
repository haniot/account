import { IService } from './service.interface'
import { Goal } from '../domain/model/goal'
import { IQuery } from './query.interface'

/**
 * Interface of the Goal service.
 * Must be implemented by the goal service at the application layer.
 *
 * @see {@link GoalService} for further information.
 * @extends {IService<Goal>}
 */
export interface IGoalService extends IService<Goal> {
    /**
     * Retrieves a Goal object from a Patient user by its id.
     *
     * @param patientId Patient id.
     * @param query Defines object to be used for queries.
     * @return {Promise<Goal>}
     * @throws {ValidationException | RepositoryException}
     */
    getFromPatient(patientId: string, query: IQuery): Promise<Goal>

    /**
     * Updates a Goal object from a Patient user.
     *
     * @param patientId Patient id.
     * @param goals Patient goals.
     * @return {Promise<Goal>}
     * @throws {ValidationException | RepositoryException}
     */
    updateFromPatient(patientId: string, goals: Goal): Promise<Goal>
}
