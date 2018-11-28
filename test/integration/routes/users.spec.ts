import { expect } from 'chai'
import request from 'supertest'
import { App } from '../../../src/app'
import { User } from '../../../src/application/domain/model/user'
import { UserType } from '../../../src/application/domain/utils/user.type'
import { CustomLogger, ILogger } from '../../../src/utils/custom.logger'
import { Application } from 'express'
import { BackgroundService } from '../../../src/background/background.service'
import { DI } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
import { ObjectID } from 'bson'

const logger: ILogger = new CustomLogger()
const app: Application = new App(logger).getExpress()
const backgroundServices: BackgroundService = DI.getInstance().getContainer().get(Identifier.BACKGROUND_SERVICE)

describe('Routes: User', () => {

    const defaultAdminUser: User = new User()
    defaultAdminUser.setName('Admin')
    defaultAdminUser.setEmail('admin@example.com')
    defaultAdminUser.setPassword('admin')

    const defaultCaregiverUser: User = new User()
    defaultCaregiverUser.setName('Lorem Ipsum')
    defaultCaregiverUser.setEmail('loremipsum@mail.com')
    defaultCaregiverUser.setPassword('lorem123')

    before(() => {
        backgroundServices.startServices()
            .then(() => UserRepoModel.deleteMany({}))
    })

    after(() => {
        UserRepoModel.deleteMany({})
            .then(() => backgroundServices.stopServices())
    })

    describe('POST /users/admin', () => {
        context('when posting a new admin user', () => {
            it('should return status code 201 and the saved user', () => {

                return request(app)
                    .post('/api/v1/users/admin')
                    .send(defaultAdminUser)
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('name')
                        expect(res.body.name).to.eql('Admin')
                        expect(res.body).to.have.property('email')
                        expect(res.body.email).to.eql('admin@example.com')
                        expect(res.body).to.have.property('type')
                        expect(res.body.type).to.eql(UserType.ADMIN)
                        expect(res.body).to.have.property('created_at')
                        defaultAdminUser.setId(res.body.id)
                    })
            })
        })

        context('when there are missing or invalid parameters in request', () => {
            it('should return status code 400 and info message from invalid email', () => {

                const invalidAdminUser: User = new User()
                invalidAdminUser.setName('Admin')
                invalidAdminUser.setEmail('invalidmail')
                invalidAdminUser.setPassword('admin')

                return request(app)
                    .post('/api/v1/users/admin')
                    .send(invalidAdminUser)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                    })
            })

            it('should return status code 400 and info message from missing parameters', () => {

                const invalidAdminUser: User = new User()
                invalidAdminUser.setName('Admin')
                invalidAdminUser.setPassword('admin')

                return request(app)
                    .post('/api/v1/users/admin')
                    .send(invalidAdminUser)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                        expect(err.body).to.have.property('description')
                    })
            })
        })

        context('when user already exists', () => {
            it('should return status code 409 and info message from duplicate data', () => {

                return request(app)
                    .post('/api/v1/users/admin')
                    .send(defaultAdminUser)
                    .set('Content-Type', 'application/json')
                    .expect(409)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                    })
            })
        })
    })

    describe('POST /users/caregiver', () => {
        context('when posting a new caregiver user', () => {
            it('should return status code 201 and the saved user', () => {

                return request(app)
                    .post('/api/v1/users/caregiver')
                    .send(defaultCaregiverUser)
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .then(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body).to.have.property('name')
                        expect(res.body.name).to.eql('Lorem Ipsum')
                        expect(res.body).to.have.property('email')
                        expect(res.body.email).to.eql('loremipsum@mail.com')
                        expect(res.body).to.have.property('type')
                        expect(res.body.type).to.eql(UserType.CAREGIVER)
                        expect(res.body).to.have.property('created_at')
                        defaultCaregiverUser.setId(res.body.id)
                    })
            })
        })

        context('when there are missing or invalid parameters in request', () => {
            it('should return status code 400 and info message from invalid email', () => {

                const invalidCaregiverUser: User = new User()
                invalidCaregiverUser.setName('Lorem Ipsum')
                invalidCaregiverUser.setEmail('invalidmail')
                invalidCaregiverUser.setPassword('loremipsum123')

                return request(app)
                    .post('/api/v1/users/caregiver')
                    .send(invalidCaregiverUser)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                    })
            })

            it('should return status code 400 and info message from missing parameters', () => {

                const invalidCaregiverUser: User = new User()
                invalidCaregiverUser.setName('Lorem Ipsum')
                invalidCaregiverUser.setPassword('loremipsum123')

                return request(app)
                    .post('/api/v1/users/caregiver')
                    .send(invalidCaregiverUser)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                        expect(err.body).to.have.property('description')
                    })
            })
        })

        context('when user already exists', () => {
            it('should return status code 409 and info message from duplicate data', () => {

                return request(app)
                    .post('/api/v1/users/caregiver')
                    .send(defaultCaregiverUser)
                    .set('Content-Type', 'application/json')
                    .expect(409)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                    })
            })
        })
    })

    describe('GET /users/:user_id', () => {
        it('should return status code 200 and a unique user', () => {

            return request(app)
                .get(`/api/v1/users/${defaultAdminUser.getId()}`)
                .set('Content-Type', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.id).to.eql(defaultAdminUser.getId())
                    expect(res.body).to.have.property('name')
                    expect(res.body.name).to.eql('Admin')
                    expect(res.body).to.have.property('email')
                    expect(res.body.email).to.eql('admin@example.com')
                    expect(res.body).to.have.property('type')
                    expect(res.body.type).to.eql(UserType.ADMIN)
                    expect(res.body).to.have.property('created_at')
                })
        })

        context('when there are no user with id parameter', () => {
            it('should return status code 404 and info message from user not found', () => {

                const randomId: ObjectID = new ObjectID()

                return request(app)
                    .get(`/api/v1/users/${randomId}`)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                        expect(err.body).to.have.property('description')
                    })
            })
        })

        context('when there are invalid parameters in request', () => {
            it('should return status code 400 and info about invalid user id', () => {

                const invalidId: string = '1a2b3c'

                return request(app)
                    .get(`/api/v1/users/${invalidId}`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                        expect(err.body).to.have.property('description')
                    })
            })
        })
    })

    describe('PATCH /users/:user_id', () => {
        it('should return status code 200 and the updated user', () => {

            return request(app)
                .patch(`/api/v1/users/${defaultAdminUser.getId()}`)
                .send({ name: 'New Admin' })
                .set('Content-Type', 'application/json')
                .then(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.id).to.eql(defaultAdminUser.getId())
                    expect(res.body).to.have.property('name')
                    expect(res.body.name).to.eql('New Admin')
                    expect(res.body).to.have.property('email')
                    expect(res.body.email).to.eql('admin@example.com')
                    expect(res.body).to.have.property('type')
                    expect(res.body.type).to.eql(UserType.ADMIN)
                    expect(res.body).to.have.property('created_at')
                })
        })

        context('when there are invalid parameters in request', () => {
            it('should return status code 400 and info message from invalid user id', () => {

                const invalidId: string = '1a2b3c'

                return request(app)
                    .patch(`/api/v1/users/${invalidId}`)
                    .send({ name: 'New Admin' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                        expect(err.body).to.have.property('description')
                    })
            })
        })

        context('when there are no user with id parameter', () => {
            it('should return status code 404 and info message from user not found', () => {

                const randomId: ObjectID = new ObjectID()

                return request(app)
                    .patch(`/api/v1/users/${randomId}`)
                    .send({ name: 'New Admin' })
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                        expect(err.body).to.have.property('description')
                    })
            })
        })

        context('when there are parameters that can not be changed', () => {
            it('should return the status code 400 and message that the type can not be changed.', () => {

                return request(app)
                    .patch(`/api/v1/users/${defaultAdminUser.getId()}`)
                    .send({ type: UserType.CAREGIVER })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                        expect(err.body).to.have.property('description')
                    })
            })

            it('should return the status code 400 and message that the password is changed by another route.', () => {

                return request(app)
                    .patch(`/api/v1/users/${defaultAdminUser.getId()}`)
                    .send({ password: 'newpassword123' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                        expect(err.body).to.have.property('description')
                    })
            })
        })
    })

    describe('PATCH /users/:user_id/password', () => {

        it('should return status code 204 and no content', () => {

            return request(app)
                .patch(`/api/v1/users/${defaultAdminUser.getId()}/password`)
                .send({ old_password: 'admin', new_password: 'admin123' })
                .set('Content-Type', 'application/json')
                .expect(204)
                .then(res => {
                    expect(res.body).to.be.empty
                })
        })

        context('when the old password does not match with user password', () => {
            it('should return status code 400 and message info about incompatible passwords', () => {

                return request(app)
                    .patch(`/api/v1/users/${defaultAdminUser.getId()}/password`)
                    .send({ old_password: 'admin', new_password: 'admin123' })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                        expect(err.body).to.have.property('description')
                    })
            })
        })

        context('when there are no user with id parameter', () => {
            it('should return status code 404 and info message from user not found', () => {

                const randomId: ObjectID = new ObjectID()

                return request(app)
                    .patch(`/api/v1/users/${randomId}/paassword`)
                    .send({ old_password: 'admin', new_password: 'admin123' })
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                        expect(err.body).to.have.property('description')
                    })
            })
        })
    })

    describe('DELETE /users/:user_id', () => {
        it('should return status code 204 and no content', () => {

            return request(app)
                .delete(`/api/v1/users/${defaultCaregiverUser.getId()}`)
                .set('Content-Type', 'application/json')
                .expect(204)
                .then(res => {
                    expect(res.body).to.be.empty
                })
        })

        context('when there are no user with id parameter', () => {
            it('should return status code 404 and info message from user not found', () => {

                const randomId: ObjectID = new ObjectID()

                return request(app)
                    .delete(`/api/v1/users/${randomId}`)
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                        expect(err.body).to.have.property('description')
                    })
            })
        })

        context('when there are invalid parameters in request', () => {
            it('should return status code 400 and info about invalid user id', () => {

                const invalidId: string = '1a2b3c'

                return request(app)
                    .delete(`/api/v1/users/${invalidId}`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                        expect(err.body).to.have.property('description')
                    })
            })
        })

    })

    describe('POST /users/auth', () => {
        it('should return a token when auth is successfully', () => {

            return request(app)
                .post('/api/v1/users/auth')
                .send({
                    email: defaultAdminUser.getEmail(),
                    password: 'admin123'
                })
                .set('Content-Type', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body).is.not.null
                    expect(res.body).to.have.property('token')
                })
        })

        context('when there are no user with id parameter', () => {
            it('should return status code 400 and info message from user not found', () => {

                return request(app)
                    .post('/api/v1/users/auth')
                    .send({
                        email: 'anyone@mail.com',
                        password: 'anyone'
                    })
                    .set('Content-Type', 'application/json')
                    .expect(404)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                        expect(err.body).to.have.property('description')
                    })
            })
        })

        context('when user needs to update your password', () => {
            it('should return status code 403 and info message from change password', () => {

                updateChangeUser(
                    { _id: defaultAdminUser.getId() },
                    { change_password: true })

                return request(app)
                    .post('/api/v1/users/auth')
                    .send({
                        email: defaultAdminUser.getEmail(),
                        password: 'admin123'
                    })
                    .set('Content-Type', 'application/json')
                    .expect(403)
                    .then(err => {
                        expect(err.body).to.have.property('message')
                        expect(err.body).to.have.property('description')
                        expect(err.body).to.have.property('redirect_link')
                    })
            })
        })
    })

    describe('GET /users', () => {
        it('should return status code 200 and a list of users', () => {

            return request(app)
                .get('/api/v1/users')
                .set('Content-Type', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body).to.have.lengthOf(2)
                    expect(res.body[0]).to.have.property('id')
                    expect(res.body[0]).to.have.property('name')
                    expect(res.body[0]).to.have.property('email')
                    expect(res.body[0]).to.have.property('type')
                    expect(res.body[1]).to.have.property('id')
                    expect(res.body[1]).to.have.property('name')
                    expect(res.body[1]).to.have.property('email')
                    expect(res.body[1]).to.have.property('type')
                })
        })
    })

    context('when there are no users in database', () => {
        it('should return status code 200 and a empty list', () => {

            deleteMany()

            return request(app)
                .get('/api/v1/users')
                .set('Content-Type', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body).to.be.empty
                })
        })
    })
})

async function deleteMany() {
    await UserRepoModel.deleteMany({})
}

async function updateChangeUser(conditions, doc) {
    await UserRepoModel.updateOne(conditions, doc).exec()
}
