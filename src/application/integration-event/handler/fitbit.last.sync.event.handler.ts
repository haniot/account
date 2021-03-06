import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { Identifier } from '../../../di/identifiers'
import { inject } from 'inversify'
import { ILogger } from '../../../utils/custom.logger'
import { FitbitLastSyncEvent } from '../event/fitbit.last.sync.event'
import { ObjectIdValidator } from '../../domain/validator/object.id.validator'
import { Strings } from '../../../utils/strings'
import { IPatientRepository } from '../../port/patient.repository.interface'
import { DatetimeValidator } from '../../domain/validator/date.time.validator'

export class FitbitLastSyncEventHandler implements IIntegrationEventHandler<FitbitLastSyncEvent> {
    /**
     * Creates an instance of FitbitLastSyncEventHandler.
     *
     * @param _patientRepository
     * @param _logger
     */
    constructor(
        @inject(Identifier.PATIENT_REPOSITORY) private readonly _patientRepository: IPatientRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async handle(event: FitbitLastSyncEvent): Promise<void> {
        try {
            if (!event.fitbit || !event.fitbit.user_id || !event.fitbit.last_sync) return
            const patientId: string = event.fitbit.user_id
            const lastSync: string = event.fitbit.last_sync

            // 1. Validate user_id and last_sync
            ObjectIdValidator.validate(patientId, Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)
            DatetimeValidator.validate(lastSync)

            // 2. Try to update the patient
            await this._patientRepository.updateLastSync(patientId, new Date(lastSync))

            // 3. If got here, it's because the action was successful.
            this._logger.info(`Action for event ${event.event_name} associated with patient with ID: ${patientId} successfully held!`)
        } catch (err) {
            this._logger.warn(`An error occurred while attempting `
                .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                .concat(err.description ? ' ' + err.description : ''))
        }
    }
}
