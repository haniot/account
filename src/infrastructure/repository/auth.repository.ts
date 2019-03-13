/**
 * Implementation of the auth repository.
 *
 * @implements {IAuthRepository}
 */
import { inject, injectable } from 'inversify'
import { IAuthRepository } from '../../application/port/auth.repository.interface'
import { Identifier } from '../../di/identifiers'
import { User } from '../../application/domain/model/user'
import { IUserRepository } from '../../application/port/user.repository.interface'
import { ILogger } from '../../utils/custom.logger'
import { UserEntity } from '../entity/user.entity'
import { Default } from '../../utils/default'
import { UserType } from '../../application/domain/utils/user.type'
import jwt from 'jsonwebtoken'
import { RepositoryException } from '../../application/domain/exception/repository.exception'
import { Strings } from '../../utils/strings'
import { ChangePasswordException } from '../../application/domain/exception/change.password.exception'
import { AuthenticationException } from '../../application/domain/exception/authentication.exception'
import { IEntityMapper } from '../port/entity.mapper.interface'

@injectable()
export class AuthRepository implements IAuthRepository {

    constructor(
        @inject(Identifier.USER_REPO_MODEL) readonly userModel: any,
        @inject(Identifier.USER_ENTITY_MAPPER) readonly userMapper: IEntityMapper<User, UserEntity>,
        @inject(Identifier.USER_REPOSITORY) private readonly _userRepository: IUserRepository,
        @inject(Identifier.LOGGER) readonly logger: ILogger
    ) {
    }

    public authenticate(userMail: string, password: string): Promise<object> {
        return new Promise<object>((resolve, reject) => {
            this.userModel.findOne({ email: userMail })
                .then(user => {
                    /* Validate password and generate access token*/
                    if (!user || !user.password) {
                        return reject(
                            new AuthenticationException(
                                'Authentication failed due to invalid authentication credentials.'
                            )
                        )
                    }
                    if (user.change_password) {
                        return reject(
                            new ChangePasswordException(
                                'Change password is necessary.',
                                `To ensure information security, the user must change the access password.` +
                                `To change it, access PATCH /users/${user._id}/password.`,
                                `/users/${user._id}/password`))
                    }

                    if (this._userRepository.comparePasswords(password, user.password)) {
                        return resolve(this.generateAccessToken(user))
                    }
                    return resolve(undefined)
                }).catch(err => reject(new RepositoryException(Strings.ERROR_MESSAGE.UNEXPECTED)))
        })
    }

    public generateAccessToken(user: any): object {
        const payload: any = {
            sub: user._id,
            iss: 'haniot',
            iat: Math.round(Date.now() / 1000),
            exp: Math.round(Date.now() / 1000 + 24 * 60 * 60)
        }
        payload.scope =
            user.type === UserType.ADMIN ?
                'caregiverAccount:create caregiverAccount:deleteAll ' +
                'caregiverAccount:readAll caregiverAccount:updateAll adminAccount:create ' +
                'adminAccount:deleteAll adminAccount:readAll adminAccount:updateAll'
                :
                'caregiverAccount:delete caregiverAccount:read ' +
                'caregiverAccount:update'

        const secret: string = process.env.JWT_SECRET || Default.JWT_SECRET
        const userToken: object = { token: jwt.sign(payload, secret) }

        return userToken
    }
}
