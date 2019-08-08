import { Entity } from './entity'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { HealthProfessional } from './health.professional'
import { DatetimeValidator } from '../validator/date.time.validator'
import { Patient } from './patient'

export class PilotStudy extends Entity implements IJSONSerializable, IJSONDeserializable<PilotStudy> {
    private _name?: string
    private _is_active?: boolean
    private _start?: Date
    private _end?: Date
    private _total_health_professionals ?: number
    private _total_patients ?: number
    private _health_professionals?: Array<HealthProfessional>
    private _patients?: Array<Patient>
    private _location?: string

    constructor() {
        super()
    }

    get name(): string | undefined {
        return this._name
    }

    set name(value: string | undefined) {
        this._name = value
    }

    get is_active(): boolean | undefined {
        return this._is_active
    }

    set is_active(value: boolean | undefined) {
        this._is_active = value
    }

    get start(): Date | undefined {
        return this._start
    }

    set start(value: Date | undefined) {
        this._start = value
    }

    get end(): Date | undefined {
        return this._end
    }

    set end(value: Date | undefined) {
        this._end = value
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

    get health_professionals(): Array<HealthProfessional> | undefined {
        return this._health_professionals
    }

    set health_professionals(value: Array<HealthProfessional> | undefined) {
        this._health_professionals = value
    }

    get patients(): Array<Patient> | undefined {
        return this._patients
    }

    set patients(value: Array<Patient> | undefined) {
        this._patients = value
    }

    get location(): string | undefined {
        return this._location
    }

    set location(value: string | undefined) {
        this._location = value
    }

    public addHealthProfessional(healthProfessional: HealthProfessional) {
        if (!this.health_professionals) this.health_professionals = []
        this.health_professionals.push(healthProfessional)
        this.health_professionals = this.removeRepeatHealthProfessional(this.health_professionals)
    }

    public removeRepeatHealthProfessional(healthProfessionals: Array<HealthProfessional>) {
        return healthProfessionals.filter((obj, pos, arr) => {
            return arr.map(group => group.id).indexOf(obj.id) === pos
        })
    }

    public addPatient(patient: Patient) {
        if (!this.patients) this.patients = []
        this.patients.push(patient)
        this.patients = this.removeRepeatPatient(this.patients)
    }

    public removeRepeatPatient(patients: Array<Patient>) {
        return patients.filter((obj, pos, arr) => {
            return arr.map(group => group.id).indexOf(obj.id) === pos
        })
    }

    public convertDatetimeString(value: any): Date {
        if (typeof value !== 'string') value = new Date(value).toISOString()
        DatetimeValidator.validate(value)
        return new Date(value)
    }

    public fromJSON(json: any): PilotStudy {
        if (!json) return this
        if (typeof json === 'string') {
            if (!JsonUtils.isJsonString(json)) {
                super.id = json
                return this
            } else {
                json = JSON.parse(json)
            }
        }

        if (json.id !== undefined) super.id = json.id
        if (json.name !== undefined) this.name = json.name
        if (json.is_active !== undefined) this.is_active = json.is_active
        if (json.start !== undefined) this.start = this.convertDatetimeString(json.start)
        if (json.end !== undefined) this.end = this.convertDatetimeString(json.end)
        if (json.total_health_professionals !== undefined) this.total_health_professionals = json.total_health_professionals
        if (json.total_patients !== undefined) this.total_patients = json.total_patients
        if (json.health_professionals !== undefined && json.health_professionals instanceof Array) {
            this.health_professionals = json.health_professionals.map(id => new HealthProfessional().fromJSON(id))
        }
        if (json.patients !== undefined && json.patients instanceof Array) {
            this.patients = json.patients.map(id => new Patient().fromJSON(id))
        }
        if (json.location !== undefined) this.location = json.location
        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            name: this.name,
            is_active: this.is_active,
            start: this.start,
            end: this.end,
            total_health_professionals: this.total_health_professionals,
            total_patients: this.total_patients,
            health_professionals:
                this.health_professionals ? this.health_professionals.map(healthProfessional => healthProfessional.id) : [],
            patients: this.patients ? this.patients.map(patient => patient.name) : [],
            location: this.location
        }
    }
}
