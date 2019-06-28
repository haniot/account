import { IAuthRepository } from '../../../src/application/port/auth.repository.interface'
import { User } from '../../../src/application/domain/model/user'

export class AuthRepositoryMock implements IAuthRepository {
    public authenticate(userMail: string, password: string): Promise<object> {
        return Promise.resolve({ token: 'token' })
    }

    public generateAccessToken(user: User): Promise<string> {
        return Promise.resolve('token')
    }

    public changePassword(userEmail: string, oldPassword: string, newPassword: string): Promise<boolean> {
        return Promise.resolve(true)
    }

    public comparePasswords(passwordOne: string, passwordTwo: string): boolean {
        return passwordOne === passwordTwo
    }

    public encryptPassword(password: string): string {
        return password
    }

}
