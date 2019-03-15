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
    private _username?: string // Username for user authentication.
    private _password?: string // Password for user authentication.
    private _type?: string // Type of user. Can be Child, Educator, Health Professional or Family.
    private _scopes!: Array<string> // Scope that signal the types of access the user has.
    private _change_password?: boolean

    constructor() {
        super()
    }

    get username(): string | undefined {
        return this._username
    }

    set username(value: string | undefined) {
        this._username = value
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
        if (json.username !== undefined) this.username = json.username
        if (json.password !== undefined) this.password = json.password
        if (json.scope !== undefined) this.scopes = json.scope

        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            username: this.username,
            type: this.type
        }
    }
}
