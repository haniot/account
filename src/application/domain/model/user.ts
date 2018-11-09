import { Entity } from './entity'
import { ISerializable } from '../utils/serializable.interface'

/**
 * Implementation of the user entity.
 *
 * @extends {Entity}
 * @implements {ISerializable<User>}
 */
export class User extends Entity implements ISerializable<User> {
    private email?: string
    private password?: string
    private type?: number
    private created_at?: Date

    constructor(email?: string, password?: string, type?: number, id?: string) {
        super(id)
        this.setEmail(email)
        this.setPassword(password)
        this.setType(type)
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
            email: this.email,
            password: this.password,
            type: this.type,
            created_at: this.created_at ? this.created_at.toISOString() : this.created_at
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
        if (json.email) this.setEmail(json.email)
        if (json.password) this.setPassword(json.password)
        if (json.type) this.setType(json.type)
        if (json.created_at) this.setCreatedAt(new Date(json.created_at))

        return this
    }
}
