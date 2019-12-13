import { ValidationException } from '../exception/validation.exception'
import { NumberValidator } from './number.validator'
import { Goal } from '../model/goal'

export class GoalValidator {
    public static validate(item: Goal): void | ValidationException {
        if (item.steps !== undefined) NumberValidator.validate(item.steps, 'steps')
        if (item.calories !== undefined) NumberValidator.validate(item.calories, 'calories')
        if (item.distance !== undefined) NumberValidator.validate(item.distance, 'distance')
        if (item.active_minutes !== undefined) NumberValidator.validate(item.active_minutes, 'active_minutes')
        if (item.sleep !== undefined) NumberValidator.validate(item.sleep, 'sleep')
    }
}
