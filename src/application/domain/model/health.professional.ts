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
        super.scopes = [
            'healthprofessionals:read',
            'healthprofessionals:update',
            'patients:create',
            'patients:read',
            'patients:update',
            'patients:delete',
            'pilots:create',
            'pilots:read',
            'pilots:update',
            'pilots:delete',
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
            'evaluations:create',
            'evaluations:read',
            'evaluations:update',
            'evaluations:delete',
            'notifications:create',
            'notifications:read',
            'notifications:delete'
        ]
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
        if (typeof json === 'string') {
            if (!JsonUtils.isJsonString(json)) {
                super.id = json
                return this
            } else {
                json = JSON.parse(json)
            }
        }

        super.fromJSON(json)
        if (json.email !== undefined) this.email = json.email
        if (json.name !== undefined) this.name = json.name
        if (json.health_area !== undefined) this.health_area = json.health_area

        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            ...{ email: this.email, name: this.name, health_area: this.health_area }
        }
    }
}
