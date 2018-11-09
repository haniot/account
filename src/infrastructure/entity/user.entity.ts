export class UserEntity {
    private id?: string
    private email?: string
    private password?: string
    private type?: number
    private created_at?: Date

    public getId(): string | undefined {
        return this.id
    }
    public setId(value: string | undefined) {
        this.id = value
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
}
