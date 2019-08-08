import { EventType, IntegrationEvent } from './integration.event'
import { Email } from '../../domain/model/email'

export class EmailUpdatePasswordEvent extends IntegrationEvent<Email> {
    constructor(public timestamp?: Date, public email?: Email) {
        super('EmailUpdatePasswordEvent', EventType.EMAIL, timestamp)
    }

    public toJSON(): any {
        if (!this.email) return {}
        return {
            ...super.toJSON(),
            email: {
                ...this.email.toJSON()
            }
        }
    }
}
