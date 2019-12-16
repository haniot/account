import { EventType, IntegrationEvent } from './integration.event'

export class FitbitErrorEvent extends IntegrationEvent<any>{
    constructor(public timestamp?: Date, public fitbitError?: any) {
        super('FitbitErrorEvent', EventType.FITBIT, timestamp)
    }

    public toJSON(): any {
        if (!this.fitbitError) return {}
        return {
            timestamp: this.timestamp,
            event_name: this.event_name,
            fitbit: this.fitbitError
        }
    }
}
