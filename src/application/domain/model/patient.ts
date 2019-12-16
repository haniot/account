import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { User } from './user'
import { UserType } from '../utils/user.type'
import { Goal } from './goal'
import { ExternalServices } from './external.services'
import { AccessStatusTypes } from '../utils/access.status.types'

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
            'series:read'
        ]
        this.goals = new Goal(10000, 2600, 8000, 60, 480)   // Default goals
        this.external_services = new ExternalServices(AccessStatusTypes.NONE)   // Default external services
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
        if (json.address !== undefined) this.address = json.address

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
