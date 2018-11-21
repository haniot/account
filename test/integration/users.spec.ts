import { expect } from 'chai'
import request from 'supertest'
import { App } from '../../src/app'
import { User } from '../../src/application/domain/model/user'
import { UserType } from '../../src/application/domain/utils/user.type'
import { CustomLogger, ILogger } from '../../src/utils/custom.logger'
import { Application } from 'express'
import { BackgroundService } from '../../src/background/background.service'
import { DI } from '../../src/di/di'
import { Identifier } from '../../src/di/identifiers'
import { UserRepoModel } from '../../src/infrastructure/database/schema/user.schema'

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
                        expect(res.body).to.have.property('password')
                        expect(res.body).to.have.property('type')
                        expect(res.body.type).to.eql(UserType.ADMIN)
                        expect(res.body).to.have.property('created_at')
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
                        expect(res.body).to.have.property('password')
                        expect(res.body).to.have.property('type')
                        expect(res.body.type).to.eql(UserType.CAREGIVER)
                        expect(res.body).to.have.property('created_at')
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
})
