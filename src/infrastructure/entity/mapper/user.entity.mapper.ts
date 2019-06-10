import { injectable } from 'inversify'
import { User } from '../../../application/domain/model/user'
import { UserEntity } from '../user.entity'
import { IEntityMapper } from '../../port/entity.mapper.interface'

@injectable()
export class UserEntityMapper implements IEntityMapper<User, UserEntity> {
    public transform(item: any): any {
        if (item instanceof User) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }

    /**
     * Convert {User} for {UserEntity}.
     *
     * @see Before setting the value, it is important to verify that the type is valid.
     * Therefore, you do not run the risk that in an UPDATE / PATCH action type,
     * attributes that should not be updated are saved with null values.
     * @see Creation Date should not be mapped to the type the repository understands.
     * Because this attribute is created automatically by the database.
     * Therefore, if a null value is passed at update time, an exception is thrown.
     * @param item
     */
    public modelToModelEntity(item: User): UserEntity {
        const result: UserEntity = new UserEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.password !== undefined) result.password = item.password
        if (item.type !== undefined) result.type = item.type
        if (item.scopes !== undefined) result.scopes = item.scopes
        if (item.change_password !== undefined) result.change_password = item.change_password
        if (item.phone_number !== undefined) result.phone_number = item.phone_number


        return result
    }

    /**
     * Convert {UserEntity} for {User}.
     *
     * @see Each attribute must be mapped only if it contains an assigned value,
     * because at some point the attribute accessed may not exist.
     * @param item
     */
    public modelEntityToModel(item: UserEntity): User {
        throw Error('Not implemented!')
    }

    /**
     * Convert JSON for {User}.
     *
     * @see Each attribute must be mapped only if it contains an assigned value,
     * because at some point the attribute accessed may not exist.
     * @param json
     */
    public jsonToModel(json: any): User {
        const result: User = new User()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.password !== undefined) result.password = json.password
        if (json.type !== undefined) result.type = json.type
        if (json.scopes !== undefined) result.scopes = json.scopes
        if (json.phone_number !== undefined) result.phone_number = json.phone_number

        return result
    }
}
