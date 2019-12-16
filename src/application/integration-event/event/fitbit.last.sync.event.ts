import { EventType, IntegrationEvent } from './integration.event'
import { Fitbit } from '../../domain/model/fitbit'

export class FitbitLastSyncEvent extends IntegrationEvent<Fitbit>{
    constructor(public timestamp?: Date, public fitbitLastSync?: Fitbit) {
        super('FitbitLastSyncEvent', EventType.FITBIT, timestamp)
    }

    public toJSON(): any {
        if (!this.fitbitLastSync) return {}
        return {
            timestamp: this.timestamp,
            event_name: this.event_name,
            fitbit: this.fitbitLastSync.toJSON()
        }
    }
}
