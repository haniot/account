import { EventType, IntegrationEvent } from './integration.event'
import { Fitbit } from '../../domain/model/fitbit'

export class FitbitRevokeEvent extends IntegrationEvent<Fitbit>{
    constructor(public timestamp?: Date, public fitbitRevoke?: Fitbit) {
        super('FitbitRevokeEvent', EventType.FITBIT, timestamp)
    }

    public toJSON(): any {
        if (!this.fitbitRevoke) return {}
        return {
            timestamp: this.timestamp,
            event_name: this.event_name,
            fitbit: this.fitbitRevoke.toJSON()
        }
    }
}
