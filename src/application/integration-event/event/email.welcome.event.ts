import { EventType, IntegrationEvent } from './integration.event'
import { User } from '../../domain/model/user'

export class EmailWelcomeEvent extends IntegrationEvent<User> {
    constructor(public timestamp?: Date, public user?: User) {
        super('EmailWelcomeEvent', EventType.EMAIL, timestamp)
    }

    public toJSON(): any {
        if (!this.user) return {}
        const result: any = {
            email: {
                to: {
                    name: this.user.name,
                    email: this.user.email
                },
                lang: this.user.language
            }
        }
        if (this.user.password) result.email.password = this.user.password
        return {
            ...super.toJSON(),
            ...result
        }
    }
}
