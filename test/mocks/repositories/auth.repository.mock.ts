import { IAuthRepository } from '../../../src/application/port/auth.repository.interface'
import { User } from '../../../src/application/domain/model/user'

export class AuthRepositoryMock implements IAuthRepository {
    public authenticate(userMail: string, password: string): Promise<object> {
        return Promise.resolve({ token: 'token' })
    }

    public generateAccessToken(user: User): Promise<string> {
        return Promise.resolve('token')
    }

}
