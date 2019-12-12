import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

export class Goal implements IJSONSerializable, IJSONDeserializable<Goal> {
    private _steps?: number
    private _calories?: number
    private _distance?: number
    private _active_minutes?: number
    private _sleep?: number

    get steps(): number | undefined {
        return this._steps
    }

    set steps(value: number | undefined) {
        this._steps = value
    }

    get calories(): number | undefined {
        return this._calories
    }

    set calories(value: number | undefined) {
        this._calories = value
    }

    get distance(): number | undefined {
        return this._distance
    }

    set distance(value: number | undefined) {
        this._distance = value
    }

    get active_minutes(): number | undefined {
        return this._active_minutes
    }

    set active_minutes(value: number | undefined) {
        this._active_minutes = value
    }

    get sleep(): number | undefined {
        return this._sleep
    }

    set sleep(value: number | undefined) {
        this._sleep = value
    }

    public fromJSON(json: any): Goal {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }
        if (json.steps !== undefined) this.steps = json.steps
        if (json.calories !== undefined) this.calories = json.calories
        if (json.distance !== undefined) this.distance = json.distance
        if (json.active_minutes !== undefined) this.active_minutes = json.active_minutes
        if (json.sleep !== undefined) this.sleep = json.sleep

        return this
    }

    public toJSON(): any {
        return {
            steps: this.steps,
            calories: this.calories,
            distance: this.distance,
            active_minutes: this.active_minutes,
            sleep: this.sleep
        }
    }
}
