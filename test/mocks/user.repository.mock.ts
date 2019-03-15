import { IUserRepository } from '../../src/application/port/user.repository.interface'
import { IQuery } from '../../src/application/port/query.interface'
import { User } from '../../src/application/domain/model/user'

export class UserRepositoryMock implements IUserRepository {
    public changePassword(id: string, old_password: string, new_password: string): Promise<boolean> {
        return Promise.resolve(true)
    }

    public checkExist(username?: string, email?: string): Promise<boolean> {
        return Promise.resolve(true)
    }

    public comparePasswords(password_one: string, password_two: string): boolean {
        return password_one === password_two
    }

    public count(query: IQuery): Promise<number> {
        return Promise.resolve(1)
    }

    public create(item: User): Promise<User> {
        return Promise.resolve(new User())
    }

    public delete(id: string): Promise<boolean> {
        return Promise.resolve(true)
    }

    public encryptPassword(password: string): string {
        return ''
    }

    public find(query: IQuery): Promise<Array<User>> {
        return Promise.resolve([new User()])
    }

    public findOne(query: IQuery): Promise<User> {
        return Promise.resolve(new User())
    }

    public update(item: User): Promise<User> {
        return Promise.resolve(new User())
    }
}
