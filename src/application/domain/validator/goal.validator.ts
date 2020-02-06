import { ValidationException } from '../exception/validation.exception'
import { IntegerPositiveValidator } from './integer.positive.validator'
import { Goal } from '../model/goal'
import { NumberPositiveValidator } from './number.positive.validator'

export class GoalValidator {
    public static validate(item: Goal): void | ValidationException {
        if (item.steps !== undefined) IntegerPositiveValidator.validate(item.steps, 'steps')
        if (item.calories !== undefined) NumberPositiveValidator.validate(item.calories, 'calories')
        if (item.distance !== undefined) NumberPositiveValidator.validate(item.distance, 'distance')
        if (item.active_minutes !== undefined) IntegerPositiveValidator.validate(item.active_minutes, 'active_minutes')
        if (item.sleep !== undefined) IntegerPositiveValidator.validate(item.sleep, 'sleep')
    }
}
