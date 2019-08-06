import { PilotStudy } from '../model/pilot.study'
import { ValidationException } from '../exception/validation.exception'
import { ObjectIdValidator } from './object.id.validator'

export class CreatePilotStudyValidator {
    public static validate(item: PilotStudy) {
        const fields: Array<string> = []

        if (!item.name) fields.push('name')
        if (item.is_active === undefined) fields.push('is_active')
        if (!item.start) fields.push('start')
        if (!item.end) fields.push('end')
        if (item.health_professionals && item.health_professionals.length) {
            item.health_professionals.map(healthProfessional => {
                if (!healthProfessional.id) {
                    fields.push(('Collection with health_professional IDs (ID cannot be empty)'))
                } else ObjectIdValidator.validate(healthProfessional.id)
            })
        }

        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'Pilot Study validation: '.concat(fields.join(', ')).concat(' required!'))
        }
    }
}
