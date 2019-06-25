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
    private _name?: string
    private _health_area?: string
    private _total_pilot_studies ?: number
    private _total_patients ?: number

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

    get total_pilot_studies(): number | undefined {
        return this._total_pilot_studies
    }

    set total_pilot_studies(value: number | undefined) {
        this._total_pilot_studies = value
    }

    get total_patients(): number | undefined {
        return this._total_patients
    }

    set total_patients(value: number | undefined) {
        this._total_patients = value
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
        if (json.name !== undefined) this.name = json.name
        if (json.health_area !== undefined) this.health_area = json.health_area
        if (json.total_pilot_studies !== undefined) this.total_pilot_studies = json.total_pilot_studies
        if (json.total_patients !== undefined) this.total_patients = json.total_patients

        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            ...{
                name: this.name,
                health_area: this.health_area,
                total_pilot_studies: this.total_pilot_studies,
                total_patients: this.total_patients
            }
        }
    }
}
