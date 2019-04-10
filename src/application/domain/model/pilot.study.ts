import { Entity } from './entity'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { HealthProfessional } from './health.professional'
import { DatetimeValidator } from '../validator/date.time.validator'

export class PilotStudy extends Entity implements IJSONSerializable, IJSONDeserializable<PilotStudy> {
    private _name?: string
    private _is_active?: boolean
    private _start?: Date
    private _end?: Date
    private _health_professionals_id?: Array<HealthProfessional>

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

    get health_professionals_id(): Array<HealthProfessional> | undefined {
        return this._health_professionals_id
    }

    set health_professionals_id(value: Array<HealthProfessional> | undefined) {
        this._health_professionals_id = value
    }

    public addHealthProfessional(healthProfessional: HealthProfessional) {
        if (!this.health_professionals_id) this.health_professionals_id = []
        this.health_professionals_id.push(healthProfessional)
        this.health_professionals_id = this.removeRepeatHealthProfessional(this.health_professionals_id)
    }

    public removeRepeatHealthProfessional(healthProfessionals: Array<HealthProfessional>) {
        return healthProfessionals.filter((obj, pos, arr) => {
            return arr.map(group => group.id).indexOf(obj.id) === pos
        })
    }

    public convertDatetimeString(value: string): Date {
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
        if (json.health_professionals_id !== undefined && json.health_professionals_id instanceof Array)
            this.health_professionals_id =
                json.health_professionals_id.map(id => new HealthProfessional().fromJSON(id))
        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            name: this.name,
            is_active: this.is_active,
            start: this.start,
            end: this.end,
            health_professionals_id:
                this.health_professionals_id ?
                    this.health_professionals_id.map(healthProfessional => healthProfessional.id) : []
        }
    }
}
