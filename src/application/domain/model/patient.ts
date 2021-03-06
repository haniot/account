import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { User } from './user'
import { UserType } from '../utils/user.type'
import { Goal } from './goal'
import { ExternalServices } from './external.services'

export class Patient extends User implements IJSONSerializable, IJSONDeserializable<Patient> {
    private _gender?: string
    private _address?: string
    private _goals!: Goal       // Patient goals
    private _external_services!: ExternalServices       // External Patient services

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
            'notifications:delete',
            'activities:create',
            'activities:read',
            'activities:update',
            'activities:delete',
            'sleep:create',
            'sleep:read',
            'sleep:update',
            'sleep:delete',
            'series:read',
            'external:sync'
        ]
    }

    get gender(): string | undefined {
        return this._gender
    }

    set gender(value: string | undefined) {
        this._gender = value
    }

    get address(): string | undefined {
        return this._address
    }

    set address(value: string | undefined) {
        this._address = value
    }

    get goals(): Goal {
        return this._goals
    }

    set goals(value: Goal) {
        this._goals = value
    }

    get external_services(): ExternalServices {
        return this._external_services
    }

    set external_services(value: ExternalServices) {
        this._external_services = value
    }

    public fromJSON(json: any): Patient {
        if (!json) return this
        super.fromJSON(json)

        if (typeof json === 'string') {
            if (!JsonUtils.isJsonString(json)) {
                super.id = json
                return this
            } else {
                json = JSON.parse(json)
            }
        }

        if (json.gender) this.gender = json.gender
        if (json.address) this.address = json.address

        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            ...{
                gender: this.gender,
                address: this.address,
                external_services: this.external_services ? this.external_services.toJSON() : this.external_services
            }
        }
    }
}
