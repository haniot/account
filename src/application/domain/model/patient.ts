import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { User } from './user'
import { UserType } from '../utils/user.type'
import { GenderTypes } from '../utils/gender.types'

export class Patient extends User implements IJSONSerializable, IJSONDeserializable<Patient> {
    private _gender?: GenderTypes

    constructor() {
        super()
        super.type = UserType.PATIENT
        super.scopes = [
            'patients:read',
            'patients:update',
            'patients:delete',
            'pilots:read',
            'measurements:create',
            'measurements:read',
            'measurements:update',
            'measurements:delete',
            'devices:create',
            'devices:read',
            'devices:update',
            'devices:delete',
            'forms:create',
            'forms:read',
            'forms:update',
            'forms:delete',
            'evaluations:read',
            'notifications:create',
            'notifications:read',
            'notifications:delete'
        ]
    }

    get gender(): GenderTypes | undefined {
        return this._gender
    }

    set gender(value: GenderTypes | undefined) {
        this._gender = value
    }

    public fromJSON(json: any): Patient {
        if (!json) return this
        if (typeof json === 'string') {
            if (!JsonUtils.isJsonString(json)) {
                super.id = json
                return this
            } else {
                json = JSON.parse(json)
            }
        }
        super.fromJSON(json)
        if (json.id !== undefined) super.id = json.id
        if (json.email !== undefined) this.email = json.email
        if (json.gender !== undefined) this.gender = json.gender

        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            ...{
                gender: this.gender
            }
        }
    }
}
