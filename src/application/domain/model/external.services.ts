import { IJSONSerializable } from '../utils/json.serializable.interface'
import { AccessStatusTypes } from '../utils/access.status.types'

export class ExternalServices implements IJSONSerializable {
    private _fitbit_status?: AccessStatusTypes
    private _fitbit_last_sync?: Date

    constructor(fitbit_status?: AccessStatusTypes, fitbit_last_sync?: Date) {
        this.fitbit_status = fitbit_status ? fitbit_status : undefined
        this.fitbit_last_sync = fitbit_last_sync ? fitbit_last_sync : undefined
    }

    get fitbit_status(): AccessStatusTypes | undefined {
        return this._fitbit_status
    }

    set fitbit_status(value: AccessStatusTypes | undefined){
        this._fitbit_status = value
    }

    get fitbit_last_sync(): Date | undefined {
        return this._fitbit_last_sync
    }

    set fitbit_last_sync(value: Date | undefined) {
        this._fitbit_last_sync = value
    }

    public toJSON(): any {
        return {
            fitbit_status: this.fitbit_status,
            fitbit_last_sync: this.fitbit_last_sync ? this.fitbit_last_sync : ''
        }
    }
}
