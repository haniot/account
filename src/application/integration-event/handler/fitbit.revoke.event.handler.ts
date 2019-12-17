import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { Identifier } from '../../../di/identifiers'
import { inject } from 'inversify'
import { ILogger } from '../../../utils/custom.logger'
import { ObjectIdValidator } from '../../domain/validator/object.id.validator'
import { Strings } from '../../../utils/strings'
import { Patient } from '../../domain/model/patient'
import { AccessStatusTypes } from '../../domain/utils/access.status.types'
import { IPatientRepository } from '../../port/patient.repository.interface'
import { FitbitRevokeEvent } from '../event/fitbit.revoke.event'

export class FitbitRevokeEventHandler implements IIntegrationEventHandler<FitbitRevokeEvent> {
    /**
     * Creates an instance of FitbitRevokeEventHandler.
     *
     * @param _patientRepository
     * @param _logger
     */
    constructor(
        @inject(Identifier.PATIENT_REPOSITORY) private readonly _patientRepository: IPatientRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async handle(event: FitbitRevokeEvent): Promise<void> {
        try {
            if (!event.fitbit || !event.fitbit.patient_id) return
            const patientId: string = event.fitbit.patient_id

            // 1. Validate child_id
            ObjectIdValidator.validate(patientId, Strings.PATIENT.PARAM_ID_NOT_VALID_FORMAT)

            const patientUp: Patient = new Patient()
            patientUp.id = patientId
            patientUp.external_services.fitbit_status = AccessStatusTypes.NONE

            // 2. Try to update the patient
            await this._patientRepository.update(patientUp)

            // 3. If got here, it's because the action was successful.
            this._logger.info(`Action for event ${event.event_name} associated with patient with ID: ${patientId} successfully held!`)
        } catch (err) {
            this._logger.warn(`An error occurred while attempting `
                .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                .concat(err.description ? ' ' + err.description : ''))
        }
    }
}
