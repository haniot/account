/**
 * Implementation of generic entity.
 * Theoretically, the other entity must inherit it.
 *
 * @abstract
 */
export abstract class Entity {
    private _id?: string
    private _created_at?: string

    protected constructor(id?: string, created_at?: string) {
        this.id = id
        this.created_at = created_at
    }

    get id(): string | undefined {
        return this._id
    }

    set id(value: string | undefined) {
        this._id = value
    }

    get created_at(): string | undefined {
        return this._created_at
    }

    set created_at(value: string | undefined) {
        this._created_at = value
    }
}
