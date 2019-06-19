export class UserEntity {
    public id?: string
    public password?: string
    public type?: string
    public scopes?: Array<string>
    public change_password?: boolean
    public email_verified?: boolean
    public phone_number?: string
}
