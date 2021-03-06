import { EventType, IntegrationEvent } from './integration.event'
import { Fitbit } from '../../domain/model/fitbit'

export class FitbitLastSyncEvent extends IntegrationEvent<Fitbit>{
    public static readonly ROUTING_KEY: string = 'fitbit.lastsync'

    constructor(public timestamp?: Date, public fitbit?: Fitbit) {
        super('FitbitLastSyncEvent', EventType.FITBIT, timestamp)
    }

    public toJSON(): any {
        if (!this.fitbit) return {}
        return {
            ...super.toJSON(),
            fitbit: {
                ...this.fitbit.toJSON()
            }
        }
    }
}
