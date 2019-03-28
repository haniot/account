import { expect } from 'chai'
import { Admin } from '../../../src/application/domain/model/admin'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { Container } from 'inversify'
import { DI } from '../../../src/di/di'
import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { DefaultEntityMock } from '../../mocks/default.entity.mock'
import { ObjectID } from 'bson'
import { Strings } from '../../../src/utils/strings'

const container: Container = DI.getInstance().getContainer()
const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
const app: App = container.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: UsersAdmins', () => {
    const user: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)

    before(async () => {
            try {
                await dbConnection.tryConnect(0, 500)
                await deleteAllUsers({})
            } catch (err) {
                throw new Error('Failure on Auth test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await deleteAllUsers({})
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on Auth test: ' + err.message)
        }
    })

    describe('POST /users/admins', () => {
        context('when the user is saved', () => {
            it('should return status code 201 and saved user', () => {
                return request
                    .post('/users/admins')
                    .send(DefaultEntityMock.ADMIN)
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('email')
                        expect(res.body.email).to.eql(user.email)
                        user.id = res.body.id
                    })
            })
        })

        context('when there are a admin with same unique parameters', () => {
            it('should return status code 409 and info message from duplicate items', () => {
                return request
                    .post('/users/admins')
                    .send(DefaultEntityMock.ADMIN)
                    .set('Content-Type', 'application/json')
                    .expect(409)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('A registration with the same unique data already exists!')
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from missing email', () => {
                return request
                    .post('/users/admins')
                    .send({ password: user.password })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Required fields were not provided...')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('User validation: email required!')
                    })
            })

            it('should return status code 400 and message from invalid email', () => {
                return request
                    .post('/users/admins')
                    .send({ email: 'invalid' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Invalid email address!')
                    })
            })

            it('should return status code 400 and message from missing password', () => {
                return request
                    .post('/users/admins')
                    .send({ email: user.email })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Required fields were not provided...')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('User validation: password required!')
                    })
            })

            it('should return status code 400 and message from missing email and password', () => {
                return request
                    .post('/users/admins')
                    .send({})
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Required fields were not provided...')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('User validation: email, password required!')
                    })
            })
        })
    })

    describe('GET /users/admins/:admin_id', () => {
        context('when get a unique user', () => {
            it('should return status code 200 and the user', () => {
                return request
                    .get(`/users/admins/${user.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.id).to.eql(user.id)
                        expect(res.body).to.have.property('email')
                        expect(res.body.email).to.eql(user.email)
                    })
            })
        })

        context('when the id is invalid', () => {
            it('should return status code 400 and message from invalid id', () => {
                return request
                    .get('/users/admins/123')
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

        context('when the user is not found', () => {
            it('should return status code 404 and message from user not found', () => {
                return request
                    .get(`/users/admins/${new ObjectID()}`)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql(Strings.ADMIN.NOT_FOUND)
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql(Strings.ADMIN.NOT_FOUND_DESCRIPTION)
                    })
            })
        })
    })

    describe('PATCH /users/admins/:admin_id', () => {
        context('when update a user', () => {
            it('should return status code 200 and updated user', () => {
                return request
                    .patch(`/users/admins/${user.id}`)
                    .send({ email: user.email })
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.id).to.eql(user.id)
                        expect(res.body).to.have.property('email')
                        expect(res.body.email).to.eql(user.email)
                    })
            })
        })

        context('when id is invalid', () => {
            it('should return status code 400 and info message from invalid id', () => {
                return request
                    .patch('/users/admins/123')
                    .send({ email: user.email })
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

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid email', () => {
                return request
                    .patch(`/users/admins/${user.id}`)
                    .send({ email: 'invalid' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('Invalid email address!')
                    })
            })

            it('should return status code 400 and info message from try update password', () => {
                return request
                    .patch(`/users/admins/${user.id}`)
                    .send({ password: user.password })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql('This parameter could not be updated.')
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql('A specific route to update user password already exists.' +
                            ` Access: PATCH /users/${user.id}/password to update your password.`)
                    })
            })
        })

        context('when the user is not found', () => {
            it('should return status code 404 and message from user not found', () => {
                return request
                    .patch(`/users/admins/${new ObjectID()}`)
                    .send({ email: user.email })
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(res => {
                        expect(res.body).to.have.property('message')
                        expect(res.body.message).to.eql(Strings.ADMIN.NOT_FOUND)
                        expect(res.body).to.have.property('description')
                        expect(res.body.description).to.eql(Strings.ADMIN.NOT_FOUND_DESCRIPTION)
                    })
            })
        })
    })

    describe('GET /users/admins', () => {
        context('when get all admin users', () => {
            it('should return status code 200 and a list of users', () => {
                return request
                    .get('/users/admins')
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.be.an.instanceof(Array)
                        expect(res.body).to.have.lengthOf(1)
                        expect(res.body[0]).to.have.property('id')
                        expect(res.body[0].id).to.eql(user.id)
                        expect(res.body[0]).to.have.property('email')
                        expect(res.body[0].email).to.eql(user.email)
                    })
            })
        })

        context('when there no users', () => {
            it('should return status code 200 and empty array', async () => {
                await deleteAllUsers({}).then()

                return request
                    .get('/users/admins')
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.be.an.instanceof(Array)
                        expect(res.body).to.have.lengthOf(0)
                    })
            })
        })
    })
})

async function deleteAllUsers(doc) {
    return await UserRepoModel.deleteMany(doc)
}
