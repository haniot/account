import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { User } from './user'
import { UserType } from '../utils/user.type'
import { PilotStudy } from './pilot.study'

export class Patient extends User implements IJSONSerializable, IJSONDeserializable<Patient> {
    private _pilot_studies?: Array<PilotStudy>
    private _name?: string
    private _gender?: string

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

    get pilot_studies(): Array<PilotStudy> | undefined {
        return this._pilot_studies
    }

    set pilot_studies(value: Array<PilotStudy> | undefined) {
        this._pilot_studies = value
    }

    get name(): string | undefined {
        return this._name
    }

    set name(value: string | undefined) {
        this._name = value
    }

    get gender(): string | undefined {
        return this._gender
    }

    set gender(value: string | undefined) {
        this._gender = value
    }

    public fromJSON(json: any): Patient {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }
        super.fromJSON(json)
        if (json.id !== undefined) super.id = json.id
        if (json.name !== undefined) this.name = json.name
        if (json.email !== undefined) this.email = json.email
        if (json.gender !== undefined) this.gender = json.gender
        if (json.pilot_studies !== undefined && json.pilot_studies instanceof Array) {
            this.pilot_studies = json.pilot_studies.map(item => new PilotStudy().fromJSON(item))
        }
        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            ...{
                name: this.name,
                gender: this.gender,
                pilot_studies: this.pilot_studies ? this.pilot_studies.map(item => item.toJSON()) : []
            }
        }
    }
}
