import { Entity } from './entity'
import { ISerializable } from '../utils/serializable.interface'

/**
 * Implementation of the user entity.
 *
 * @extends {Entity}
 * @implements {ISerializable<User>}
 */
export class User extends Entity implements ISerializable<User> {
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
    public toJSON(): string {
        return this.serialize()
    }

    /**
     * Convert this object to json.
     *
     * @returns {object}
     */
    public serialize(): any {
        return {
            id: super.getId(),
            name: this.name,
            email: this.email,
            password: this.password,
            type: this.type,
            created_at: this.created_at ? this.created_at.toISOString() : this.created_at,
            change_password: this.change_password
        }
    }

    /**
     * Transform JSON into User object.
     *
     * @param json
     */
    public deserialize(json: any): User {
        if (!json) return this
        if (typeof json === 'string') json = JSON.parse(json)

        if (json.id) this.setId(json.id)
        if (json.name) this.setName(json.name)
        if (json.email) this.setEmail(json.email)
        if (json.password) this.setPassword(json.password)
        if (json.type) this.setType(json.type)
        if (json.created_at) this.setCreatedAt(new Date(json.created_at))
        if (json.change_password !== undefined) this.setChangePassword(json.change_password)

        return this
    }
}
