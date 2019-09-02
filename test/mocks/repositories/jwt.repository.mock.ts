import { User } from '../../../src/application/domain/model/user'
import jwt from 'jsonwebtoken'
import { Default } from '../../../src/utils/default'
import { readFileSync } from 'fs'

export class JwtRepositoryMock {
    public static async generateResetPasswordToken(user: User): Promise<string> {
        try {
            const private_key = readFileSync(`${process.env.JWT_PRIVATE_KEY_PATH}`, 'utf-8')
            const payload: object = {
                sub: user.id,
                sub_type: user.type,
                email: user.email,
                iss: process.env.ISSUER || Default.ISSUER,
                iat: Math.floor(Date.now() / 1000),
                scope: 'users.update',
                reset_password: true
            }
            return Promise.resolve(jwt.sign(payload, private_key, { expiresIn: '1h', algorithm: 'RS256' }))
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
