import { User } from './user'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { UserType } from '../utils/user.type'
import { JsonUtils } from '../utils/json.utils'

export class Admin extends User implements IJSONSerializable, IJSONDeserializable<Admin> {
    private _email?: string

    constructor() {
        super()
        super.type = UserType.ADMIN
        super.scopes = []
    }

    get email(): string | undefined {
        return this._email
    }

    set email(value: string | undefined) {
        this._email = value
    }

    public fromJSON(json: any): Admin {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        super.fromJSON(json)
        return this
    }

    public toJSON(): any {
        return super.toJSON()
    }
}
