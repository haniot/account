import { IAuthRepository } from '../../../src/application/port/auth.repository.interface'
import { User } from '../../../src/application/domain/model/user'
import { DefaultEntityMock } from '../models/default.entity.mock'

export class AuthRepositoryMock implements IAuthRepository {
    public authenticate(userMail: string, password: string): Promise<object> {
        return Promise.resolve(userMail === DefaultEntityMock.USER.email ? { access_token: 'token' } : undefined!)
    }

    public generateAccessToken(user: User): Promise<string> {
        return Promise.resolve('token')
    }

    public resetPassword(_email: string, _type: string): Promise<User> {
        return Promise.resolve(new User().fromJSON(DefaultEntityMock.USER))
    }

    public getTokenPayload(token: string): Promise<any> {
        return Promise.resolve({})
    }

    public updatePassword(userId: string, userEmail: string, new_password: string): Promise<User> {
        return Promise.resolve(new User().fromJSON(DefaultEntityMock.USER))
    }

    public validateToken(token: string): Promise<boolean> {
        return Promise.resolve(true)
    }
}
