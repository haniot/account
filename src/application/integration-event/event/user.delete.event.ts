import { EventType, IntegrationEvent } from './integration.event'
import { User } from '../../domain/model/user'

export class UserDeleteEvent extends IntegrationEvent<User> {
    constructor(public timestamp?: Date, public user?: User) {
        super('UserDeleteEvent', EventType.USER, timestamp)
    }

    public toJSON(): any {
        if (!this.user) return {}
        return {
            ...super.toJSON(),
            ...{ user: { id: this.user.id, type: this.user.type } }
        }
    }
}
