import { User } from '../../../src/application/domain/model/user'
import jwt from 'jsonwebtoken'
import { Default } from '../../../src/utils/default'
import { readFileSync } from 'fs'
import { AuthenticationException } from '../../../src/application/domain/exception/authentication.exception'

export class JwtRepositoryMock {
    public static async generateResetPasswordToken(user: User, resetPassword: boolean): Promise<string> {
        try {
            const private_key = readFileSync(`${process.env.JWT_PRIVATE_KEY_PATH}`, 'utf-8')
            const payload: object = {
                sub: user.id,
                sub_type: user.type,
                email: user.email,
                iss: process.env.ISSUER || Default.ISSUER,
                iat: Math.floor(Date.now() / 1000),
                scope: 'users.update',
                reset_password: resetPassword
            }
            return Promise.resolve(jwt.sign(payload, private_key, { expiresIn: '1h', algorithm: 'RS256' }))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public static getTokenPayload(token: string): Promise<any> {
        try {
            return Promise.resolve(jwt.decode(token))
        } catch (err) {
            return Promise.reject(new AuthenticationException('Could not complete change password request. ' +
                'Please try again later.'))
        }
    }

    public static validateToken(token: string): Promise<boolean> {
        try {
            const public_key = readFileSync(`${process.env.JWT_PUBLIC_KEY_PATH}`, 'utf-8')
            const result = jwt.verify(token, public_key, { algorithms: ['RS256'] })
            return Promise.resolve(!!result)
        } catch (err) {
            return Promise.reject(new AuthenticationException('Invalid password reset token!',
                'Token probably expired or already used. You can only use the reset token once while it is within its ' +
                'validity period.'))
        }
    }
}
