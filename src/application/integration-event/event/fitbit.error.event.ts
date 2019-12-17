import { EventType, IntegrationEvent } from './integration.event'
import { Fitbit } from '../../domain/model/fitbit'

export class FitbitErrorEvent extends IntegrationEvent<any>{
    public static readonly ROUTING_KEY: string = 'fitbit.error'

    constructor(public timestamp?: Date, public fitbit?: Fitbit) {
        super('FitbitErrorEvent', EventType.FITBIT, timestamp)
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
