import { Entity } from './entity'
import { JsonUtils } from '../utils/json.utils'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'

/**
 * Implementation of the user entity.
 *
 * @extends {Entity}
 * @implements {IJSONSerializable, IJSONDeserializable<User>}
 */
export class User extends Entity implements IJSONSerializable, IJSONDeserializable<User> {
    private _password?: string // Password for user authentication.
    private _type?: string // Type of user. Can be Child, Educator, Health Professional or Family.
    private _scopes!: Array<string> // Scope that signal the types of access the user has.
    private _change_password?: boolean
    private _phone_number?: string

    constructor() {
        super()
    }

    get password(): string | undefined {
        return this._password
    }

    set password(value: string | undefined) {
        this._password = value
    }

    get type(): string | undefined {
        return this._type
    }

    set type(value: string | undefined) {
        this._type = value
    }

    get scopes(): Array<string> {
        return this._scopes
    }

    set scopes(value: Array<string>) {
        this._scopes = value
    }

    get change_password(): boolean | undefined {
        return this._change_password
    }

    set change_password(value: boolean | undefined) {
        this._change_password = value
    }

    get phone_number(): string | undefined {
        return this._phone_number
    }

    set phone_number(value: string | undefined) {
        this._phone_number = value
    }

    public addScope(scope: string): void {
        if (!this.scopes) this._scopes = []
        if (scope) this._scopes.push(scope)
    }

    public removeScope(scope: string): void {
        if (scope) {
            this.scopes = this.scopes.filter(item => item !== scope)
        }
    }

    public fromJSON(json: any): User {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.id !== undefined) super.id = json.id
        if (json.password !== undefined) this.password = json.password
        if (json.scopes !== undefined) this.scopes = json.scopes
        if (json.phone_number !== undefined) this.phone_number = json.phone_number

        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            type: this.type,
            phone_number: this.phone_number
        }
    }
}
