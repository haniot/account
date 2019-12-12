import { IAuthRepository } from '../../../src/application/port/auth.repository.interface'
import { User } from '../../../src/application/domain/model/user'
import { DefaultEntityMock } from '../models/default.entity.mock'
import { JwtRepositoryMock } from './jwt.repository.mock'

export class AuthRepositoryMock implements IAuthRepository {
    public authenticate(userMail: string, password: string): Promise<object> {
        return Promise.resolve(userMail === DefaultEntityMock.USER.email ? { access_token: 'token' } : undefined!)
    }

    public resetPassword(_email: string): Promise<User> {
        return Promise.resolve(_email === DefaultEntityMock.USER.email ? new User().fromJSON(DefaultEntityMock.USER) : undefined!)
    }

    public getTokenPayload(token: string): Promise<any> {
        return JwtRepositoryMock.getTokenPayload(token)
    }

    public updatePassword(userId: string, userEmail: string, new_password: string, token: string): Promise<User> {
        return Promise.resolve(userEmail === DefaultEntityMock.USER.email ?
            new User().fromJSON(DefaultEntityMock.USER) : undefined!)
    }

    public validateToken(token: string): Promise<boolean> {
        return Promise.resolve(JwtRepositoryMock.validateToken(token))
    }
}
