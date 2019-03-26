import { expect } from 'chai'
import { Admin } from '../../../src/application/domain/model/admin'
import { UserType } from '../../../src/application/domain/utils/user.type'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { Container } from 'inversify'
import { DI } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { IAdminRepository } from '../../../src/application/port/admin.repository.interface'
import { App } from '../../../src/app'
import { ObjectID } from 'bson'
import { Strings } from '../../../src/utils/strings'

const container: Container = DI.getInstance().getContainer()
const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
const adminRepo: IAdminRepository = container.get(Identifier.ADMIN_REPOSITORY)
const app: App = container.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: Users', () => {
    const user = new Admin()
    user.email = 'admin@test.com'
    user.password = 'password'
    user.type = UserType.ADMIN
    user.change_password = false

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                const result = await adminRepo.create(user)
                user.id = result.id
            } catch (err) {
                throw new Error('Failure on User test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllUsers({})
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on User test: ' + err.message)
        }
    })

    describe('PATCH /users/:user_id/password', () => {
        context('when the password is updated', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .patch(`/users/${user.id}/password`)
                    .send({ old_password: 'password', new_password: 'new@password' })
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })

        context('when the user is not found', () => {
            it('should return status code 404 and message from user not found', () => {
                return request
                    .patch(`/users/${new ObjectID()}/password`)
                    .send({ old_password: 'password', new_password: 'new@password' })
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql(Strings.USER.NOT_FOUND)
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql(Strings.USER.NOT_FOUND_DESCRIPTION)
                    })
            })
        })

        context('when the old_password does not match', () => {
            it('should return status code 400 and message from password does not match', () => {
                return request
                    .patch(`/users/${user.id}/password`)
                    .send({ old_password: 'password', new_password: 'new@password' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql(Strings.USER.PASSWORD_NOT_MATCH)
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql(Strings.USER.PASSWORD_NOT_MATCH_DESCRIPTION)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .patch('/users/123/password')
                    .send({ old_password: 'password', new_password: 'new@password' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Some ID provided does not have a valid format!')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('A 24-byte hex ID similar to this: 507f191e810c19729de860ea ' +
                            'is expected.')
                    })
            })

            it('should return status code 400 and message from missing old_password', () => {
                return request
                    .patch(`/users/${user.id}/password`)
                    .send({ new_password: 'new@password' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Required fields were not provided...')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('Change password validation: old_password required!')
                    })
            })

            it('should return status code 400 and message from missing new_password', () => {
                return request
                    .patch(`/users/${user.id}/password`)
                    .send({ old_password: 'new@password' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Required fields were not provided...')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('Change password validation: new_password required!')
                    })
            })

            it('should return status code 400 and message from missing old_password and new_password', () => {
                return request
                    .patch(`/users/${user.id}/password`)
                    .send({})
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Required fields were not provided...')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('Change password validation: old_password, new_password required!')
                    })
            })
        })
    })

    describe('DELETE /users/:user_id', () => {
        context('when the delete was successful', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/users/${user.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })

        context('when the user is not found', () => {
            it('should return status code 404 and message from user not found', () => {
                return request
                    .delete(`/users/${new ObjectID()}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })

            })
        })

        context('when the id is invalid', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .delete('/users/123')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })
})

async function deleteAllUsers(doc) {
    return await UserRepoModel.deleteMany(doc)
}
