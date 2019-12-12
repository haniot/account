export class UserEntity {
    public type?: string
    public scopes?: Array<string>
    public change_password?: boolean
    public email_verified?: boolean
    public last_login?: Date
    public last_sync?: Date
    public selected_pilot_study?: string
    public language?: string
    public reset_password_token?: string
    public id?: string
    public created_at?: string
    public name?: string
    public email?: string
    public password?: string
    public phone_number?: string
    public birth_date?: string
    public protected?: boolean
}
