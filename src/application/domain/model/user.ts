import { Entity } from './entity'
import { JsonUtils } from '../utils/json.utils'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { DatetimeValidator } from '../validator/date.time.validator'

/**
 * Implementation of the user entity.
 *
 * @extends {Entity}
 * @implements {IJSONSerializable, IJSONDeserializable<User>}
 */
export class User extends Entity implements IJSONSerializable, IJSONDeserializable<User> {

    private _email?: string
    private _password?: string // Password for user authentication.
    private _birth_date?: string
    private _type?: string // Type of user. Can be Child, Educator, Health Professional or Family.
    private _scopes!: Array<string> // Scope that signal the types of access the user has.
    private _change_password?: boolean
    private _email_verified?: boolean
    private _phone_number?: string
    private _last_login?: Date
    private _last_sync?: Date
    private _selected_pilot_study?: string
    private _language?: string

    constructor() {
        super()
    }

    get email(): string | undefined {
        return this._email
    }

    set email(value: string | undefined) {
        this._email = value
    }

    get password(): string | undefined {
        return this._password
    }

    set password(value: string | undefined) {
        this._password = value
    }

    get birth_date(): string | undefined {
        return this._birth_date
    }

    set birth_date(value: string | undefined) {
        this._birth_date = value
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

    get email_verified(): boolean | undefined {
        return this._email_verified
    }

    set email_verified(value: boolean | undefined) {
        this._email_verified = value
    }

    get phone_number(): string | undefined {
        return this._phone_number
    }

    set phone_number(value: string | undefined) {
        this._phone_number = value
    }

    get last_login(): Date | undefined {
        return this._last_login
    }

    set last_login(value: Date | undefined) {
        this._last_login = value
    }

    get last_sync(): Date | undefined {
        return this._last_sync
    }

    set last_sync(value: Date | undefined) {
        this._last_sync = value
    }

    get selected_pilot_study(): string | undefined {
        return this._selected_pilot_study
    }

    set selected_pilot_study(value: string | undefined) {
        this._selected_pilot_study = value
    }

    get language(): string | undefined {
        return this._language
    }

    set language(value: string | undefined) {
        this._language = value
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

    public convertDatetimeString(value: any): Date {
        if (typeof value !== 'string') value = new Date(value).toISOString()
        DatetimeValidator.validate(value)
        return new Date(value)
    }

    public fromJSON(json: any): User {
        if (!json) return this
        if (typeof json === 'string') {
            if (!JsonUtils.isJsonString(json)) {
                super.id = json
                return this
            } else {
                json = JSON.parse(json)
            }
        }

        if (json.id !== undefined) super.id = json.id
        if (json.email !== undefined) this.email = json.email
        if (json.password !== undefined) this.password = json.password
        if (json.birth_date !== undefined) this.birth_date = json.birth_date
        if (json.scopes !== undefined) this.scopes = json.scopes
        if (json.phone_number !== undefined) this.phone_number = json.phone_number
        if (json.last_login !== undefined) this.last_login = this.convertDatetimeString(json.last_login)
        if (json.last_sync !== undefined) this.last_sync = this.convertDatetimeString(json.last_sync)
        if (json.selected_pilot_study !== undefined) this.selected_pilot_study = json.selected_pilot_study
        if (json.language !== undefined) this.language = json.language

        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            email: this.email,
            birth_date: this.birth_date,
            type: this.type,
            phone_number: this.phone_number,
            last_login: this.last_login,
            last_sync: this.last_sync,
            selected_pilot_study: this.selected_pilot_study,
            language: this.language
        }
    }
}
