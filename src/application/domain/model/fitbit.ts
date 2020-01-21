import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { IJSONSerializable } from '../utils/json.serializable.interface'

export class Fitbit implements IJSONSerializable, IJSONDeserializable<Fitbit> {
    private _patient_id?: string
    private _last_sync?: string
    private _error?: any

    get patient_id(): string | undefined{
        return this._patient_id
    }

    set patient_id(value: string | undefined) {
        this._patient_id = value
    }

    get last_sync(): string | undefined {
        return this._last_sync
    }

    set last_sync(value: string | undefined) {
        this._last_sync = value
    }

    get error(): any {
        return this._error
    }

    set error(value: any) {
        this._error = value
    }

    public fromJSON(json: any): Fitbit {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.patient_id) this.patient_id = json.patient_id
        if (json.last_sync) this.last_sync = json.last_sync
        if (json.error) this.error = json.error

        return this
    }

    public toJSON(): any {
        return {
            patient_id: this.patient_id,
            last_sync: this.last_sync,
            error: this.error
        }
    }
}
