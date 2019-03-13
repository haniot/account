import { User } from './user'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { UserType } from '../utils/user.type'

/**
 * Implementation of the educator entity.
 *
 * @extends {User}
 * @implements {IJSONSerializable, IJSONDeserializable<HealthProfessional>}
 */
export class HealthProfessional extends User implements IJSONSerializable, IJSONDeserializable<HealthProfessional> {
    private _email?: string
    private _name?: string
    private _health_area?: string

    constructor() {
        super()
        super.type = UserType.HEALTH_PROFESSIONAL
        super.scopes = []
    }

    get email(): string | undefined {
        return this._email
    }

    set email(value: string | undefined) {
        this._email = value
    }

    get name(): string | undefined {
        return this._name
    }

    set name(value: string | undefined) {
        this._name = value
    }

    get health_area(): string | undefined {
        return this._health_area
    }

    set health_area(value: string | undefined) {
        this._health_area = value
    }

    public fromJSON(json: any): HealthProfessional {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        super.fromJSON(json)
        return this
    }

    public toJSON(): any {
        return super.toJSON()
    }
}
