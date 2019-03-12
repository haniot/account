import { Entity } from './entity'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

/**
 * Implementation of the user entity.
 *
 * @extends {Entity}
 * @implements {ISerializable<User>}
 */
export class User extends Entity implements IJSONSerializable, IJSONDeserializable<User> {
    private name?: string
    private email?: string
    private password?: string
    private type?: number
    private created_at?: Date
    private change_password?: boolean

    constructor(name?: string, email?: string, password?: string, type?: number, change_password?: boolean, id?: string) {
        super(id)
        this.setName(name)
        this.setEmail(email)
        this.setPassword(password)
        this.setType(type)
        this.setChangePassword(change_password)
    }

    public getName(): string | undefined {
        return this.name
    }

    public setName(value: string | undefined) {
        this.name = value
    }

    public getEmail(): string | undefined {
        return this.email
    }

    public setEmail(value: string | undefined) {
        this.email = value
    }

    public getPassword(): string | undefined {
        return this.password
    }

    public setPassword(value: string | undefined) {
        this.password = value
    }

    public getType(): number | undefined {
        return this.type
    }

    public setType(value: number | undefined) {
        this.type = value
    }

    /**
     * Get registration date.
     *
     * @remarks Date in ISO 8601 format.
     */
    public getCreatedAt(): Date | undefined {
        return this.created_at
    }

    public setCreatedAt(value: Date | undefined) {
        this.created_at = value
    }

    public getChangePassword(): boolean | undefined {
        return this.change_password
    }

    public setChangePassword(value: boolean | undefined) {
        this.change_password = value
    }

    /**
     * Called as default when the object
     * is displayed in console.log()
     */
    public toJSON(): any {
        return {
            id: super.id,
            name: this.name,
            email: this.email,
            type: this.type
        }
    }

    public fromJSON(json: any): User {
        if (!json) return this

        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.id !== undefined) super.id = json.id
        if (json.name !== undefined) this.name = json.name
        if (json.email !== undefined) this.email = json.email
        if (json.password !== undefined) this.password = json.password
        if (json.type !== undefined) this.type = json.type
        if (json.created_at !== undefined) this.created_at = json.created_at
        return this
    }
}
