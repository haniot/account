import { PilotStudy } from '../model/pilot.study'
import { ValidationException } from '../exception/validation.exception'
import { ObjectIdValidator } from './object.id.validator'

export class UpdatePilotStudyValidator {
    public static validate(item: PilotStudy) {
        const fields: Array<string> = []

        if (item.id) ObjectIdValidator.validate(item.id)
        if (item.health_professionals_id && item.health_professionals_id.length > 0) {
            item.health_professionals_id.map(healthProfessional => {
                if (!healthProfessional.id)
                    fields.push(('Collection with health_professional IDs (ID cannot be empty'))
                else ObjectIdValidator.validate(healthProfessional.id)
            })
        }

        if (fields.length > 0) {
            throw new ValidationException('Pilot study parameters are invalid...',
                'Pilot Study update validation: '.concat(fields.join(', ')).concat(' required!'))
        }

    }
}
