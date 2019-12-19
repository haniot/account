import { EventType, IntegrationEvent } from './integration.event'
import { Fitbit } from '../../domain/model/fitbit'

export class FitbitRevokeEvent extends IntegrationEvent<Fitbit>{
    public static readonly ROUTING_KEY: string = 'fitbit.revoke'

    constructor(public timestamp?: Date, public fitbit?: Fitbit) {
        super('FitbitRevokeEvent', EventType.FITBIT, timestamp)
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
