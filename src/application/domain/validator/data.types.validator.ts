import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'
import { DataTypes } from '../utils/data.types'

export class DataTypesValidator {
    public static validate(dataTypesArr: Array<string>) {
        const dataTypes: Array<string> = Object.values(DataTypes)
        const invalidDataTypes: Array<string> = []

        if (!dataTypesArr.length) {
            throw new ValidationException(Strings.ERROR_MESSAGE.INVALID_FIELDS,
                Strings.ERROR_MESSAGE.INVALID_DATA_TYPES_DESC)
        }

        for (const dataTypeItem of dataTypesArr) {
            if (!dataTypes.includes(dataTypeItem)) invalidDataTypes.push(dataTypeItem)
        }

        if (invalidDataTypes.length) {
            throw new ValidationException(
                Strings.ENUM_VALIDATOR.NOT_MAPPED
                    .replace('{0}', `data_types: ${invalidDataTypes.join(', ')}`),
                Strings.ENUM_VALIDATOR.NOT_MAPPED_DESC
                    .replace('{0}', dataTypes.join(', ').concat('.')))
        }
    }
}
