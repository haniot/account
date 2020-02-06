import { User } from './user'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { UserType } from '../utils/user.type'
import { JsonUtils } from '../utils/json.utils'

export class Admin extends User implements IJSONSerializable, IJSONDeserializable<Admin> {
    private _total_pilot_studies ?: number
    private _total_admins ?: number
    private _total_health_professionals ?: number
    private _total_patients ?: number

    constructor() {
        super()
        super.type = UserType.ADMIN
        super.scopes = [
            'admins:create',
            'admins:read',
            'admins:readAll',
            'admins:update',
            'admins:delete',
            'healthprofessionals:create',
            'healthprofessionals:read',
            'healthprofessionals:readAll',
            'healthprofessionals:update',
            'healthprofessionals:delete',
            'patients:create',
            'patients:read',
            'patients:readAll',
            'patients:update',
            'patients:delete',
            'pilots:create',
            'pilots:readAll',
            'pilots:read',
            'pilots:update',
            'pilots:delete',
            'measurements:read',
            'measurements:readAll',
            'devices:read',
            'devices:readAll',
            'forms:read',
            'forms:readAll',
            'evaluations:read',
            'evaluations:readAll',
            'notifications:create',
            'notifications:read',
            'notifications:readAll',
            'notifications:delete',
            'activities:read',
            'activities:readAll',
            'sleep:read',
            'sleep:readAll',
            'series:read'
        ]
    }

    get total_pilot_studies(): number | undefined {
        return this._total_pilot_studies
    }

    set total_pilot_studies(value: number | undefined) {
        this._total_pilot_studies = value
    }

    get total_admins(): number | undefined {
        return this._total_admins
    }

    set total_admins(value: number | undefined) {
        this._total_admins = value
    }

    get total_health_professionals(): number | undefined {
        return this._total_health_professionals
    }

    set total_health_professionals(value: number | undefined) {
        this._total_health_professionals = value
    }

    get total_patients(): number | undefined {
        return this._total_patients
    }

    set total_patients(value: number | undefined) {
        this._total_patients = value
    }

    public fromJSON(json: any): Admin {
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

        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            ...{
                total_pilot_studies: this.total_pilot_studies,
                total_admins: this.total_admins,
                total_health_professionals: this.total_health_professionals,
                total_patients: this.total_patients
            }
        }
    }
}
