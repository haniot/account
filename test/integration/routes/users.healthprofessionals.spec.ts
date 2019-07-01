// import { Container } from 'inversify'
// import { DI } from '../../../src/di/di'
// import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
// import { Identifier } from '../../../src/di/identifiers'
// import { App } from '../../../src/app'
// import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
// import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
// import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
// import { expect } from 'chai'
// import { Strings } from '../../../src/utils/strings'
// import { ObjectID } from 'bson'
//
// const container: Container = DI.getInstance().getContainer()
// const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
// const app: App = container.get(Identifier.APP)
// const request = require('supertest')(app.getExpress())
//
// describe('Routes: UsersHealthProfessionals', () => {
//     const user: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)
//
//     before(async () => {
//             try {
//                 await dbConnection.tryConnect(0, 500)
//                 await deleteAllUsers({})
//             } catch (err) {
//                 throw new Error('Failure on Auth test: ' + err.message)
//             }
//         }
//     )
//
//     after(async () => {
//         try {
//             await deleteAllUsers({})
//             await dbConnection.dispose()
//         } catch (err) {
//             throw new Error('Failure on Auth test: ' + err.message)
//         }
//     })
//
//     describe('POST /users/healthprofessionals', () => {
//         context('when the user is saved', () => {
//             it('should return status code 201 and saved user', () => {
//                 return request
//                     .post('/users/healthprofessionals')
//                     .send(DefaultEntityMock.HEALTH_PROFESSIONAL)
//                     .set('Content-Type', 'application/json')
//                     .expect(201)
//                     .then(res => {
//                         expect(res.body).to.have.property('id')
//                         expect(res.body).to.have.property('email')
//                         expect(res.body.email).to.eql(user.email)
//                         expect(res.body).to.have.property('name')
//                         expect(res.body.name).to.eql(user.name)
//                         expect(res.body).to.have.property('health_area')
//                         expect(res.body.health_area).to.eql(user.health_area)
//                         user.id = res.body.id
//                     })
//             })
//         })
//
//         context('when there are a admin with same unique parameters', () => {
//             it('should return status code 409 and info message from duplicate items', () => {
//                 return request
//                     .post('/users/healthprofessionals')
//                     .send(DefaultEntityMock.HEALTH_PROFESSIONAL)
//                     .set('Content-Type', 'application/json')
//                     .expect(409)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql('A registration with the same unique data already exists!')
//                     })
//             })
//         })
//
//         context('when there are validation errors', () => {
//             it('should return status code 400 and message from missing email', () => {
//                 return request
//                     .post('/users/healthprofessionals')
//                     .send({ name: user.name, password: user.password, health_area: user.health_area })
//                     .send({ password: user.password })
//                     .set('Content-Type', 'application/json')
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql('Required fields were not provided...')
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql('User validation: email required!')
//                     })
//             })
//
//             it('should return status code 400 and message from invalid email', () => {
//                 return request
//                     .post('/users/healthprofessionals')
//                     .send({ email: 'invalid', name: user.name, password: user.password, health_area: user.health_area })
//                     .set('Content-Type', 'application/json')
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql('Invalid email address!')
//                     })
//             })
//
//             it('should return status code 400 and message from missing password', () => {
//                 return request
//                     .post('/users/healthprofessionals')
//                     .send({ email: user.email, name: user.name, health_area: user.health_area })
//                     .set('Content-Type', 'application/json')
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql('Required fields were not provided...')
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql('User validation: password required!')
//                     })
//             })
//
//             it('should return status code 400 and message from missing name', () => {
//                 return request
//                     .post('/users/healthprofessionals')
//                     .send({ email: user.email, password: user.password, health_area: user.health_area })
//                     .set('Content-Type', 'application/json')
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql('Required fields were not provided...')
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql('User validation: name required!')
//                     })
//             })
//
//             it('should return status code 400 and message from missing health_area', () => {
//                 return request
//                     .post('/users/healthprofessionals')
//                     .send({ email: user.email, name: user.name, password: user.password })
//                     .set('Content-Type', 'application/json')
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql('Required fields were not provided...')
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql('User validation: health_area required!')
//                     })
//             })
//
//             it('should return status code 400 and message from invalid health_area', () => {
//                 return request
//                     .post('/users/healthprofessionals')
//                     .send({ email: user.email, name: user.name, password: user.password, health_area: 'oncologist' })
//                     .set('Content-Type', 'application/json')
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql('Health Area not mapped!')
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql('The mapped areas are: nutrition, dentistry.')
//                     })
//             })
//
//             it('should return status code 400 and message from missing all required parameters', () => {
//                 return request
//                     .post('/users/healthprofessionals')
//                     .send({})
//                     .set('Content-Type', 'application/json')
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql('Required fields were not provided...')
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql('User validation: email, password, name, health_area required!')
//                     })
//             })
//         })
//     })
//
//     describe('GET /users/healthprofessionals/:healthprofessional_id', () => {
//         context('when get a unique user', () => {
//             it('should return status code 200 and the user', () => {
//                 return request
//                     .get(`/users/healthprofessionals/${user.id}`)
//                     .set('Content-Type', 'application/json')
//                     .expect(200)
//                     .then(res => {
//                         expect(res.body).to.have.property('id')
//                         expect(res.body.id).to.eql(user.id)
//                         expect(res.body).to.have.property('email')
//                         expect(res.body.email).to.eql(user.email)
//                         expect(res.body).to.have.property('name')
//                         expect(res.body.name).to.eql(user.name)
//                         expect(res.body).to.have.property('health_area')
//                         expect(res.body.health_area).to.eql(user.health_area)
//                     })
//             })
//         })
//
//         context('when the id is invalid', () => {
//             it('should return status code 400 and message from invalid id', () => {
//                 return request
//                     .get('/users/healthprofessionals/123')
//                     .set('Content-Type', 'application/json')
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
//                     })
//             })
//         })
//
//         context('when the user is not found', () => {
//             it('should return status code 404 and message from user not found', () => {
//                 return request
//                     .get(`/users/healthprofessionals/${new ObjectID()}`)
//                     .set('Content-Type', 'application/json')
//                     .expect(404)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql(Strings.HEALTH_PROFESSIONAL.NOT_FOUND)
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql(Strings.HEALTH_PROFESSIONAL.NOT_FOUND_DESCRIPTION)
//                     })
//             })
//         })
//     })
//
//     describe('PATCH users/healthprofessionals/:healthprofessional_id', () => {
//         context('when update a user', () => {
//             it('should return status code 200 and updated user', () => {
//                 return request
//                     .patch(`/users/healthprofessionals/${user.id}`)
//                     .send({ email: user.email, health_area: user.health_area, name: user.name })
//                     .expect(200)
//                     .then(res => {
//                         expect(res.body).to.have.property('id')
//                         expect(res.body.id).to.eql(user.id)
//                         expect(res.body).to.have.property('email')
//                         expect(res.body.email).to.eql(user.email)
//                         expect(res.body).to.have.property('email')
//                         expect(res.body.email).to.eql(user.email)
//                         expect(res.body).to.have.property('name')
//                         expect(res.body.name).to.eql(user.name)
//                         expect(res.body).to.have.property('health_area')
//                         expect(res.body.health_area).to.eql(user.health_area)
//                     })
//             })
//         })
//
//         context('when id is invalid', () => {
//             it('should return status code 400 and info message from invalid id', () => {
//                 return request
//                     .patch('/users/healthprofessionals/123')
//                     .send({ email: user.email, health_area: user.health_area, name: user.name })
//                     .set('Content-Type', 'application/json')
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql(Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT_DESC)
//                     })
//
//             })
//         })
//
//         context('when there are validation errors', () => {
//             it('should return status code 400 and message from invalid email', () => {
//                 return request
//                     .patch(`/users/healthprofessionals/${user.id}`)
//                     .send({ email: 'invalid' })
//                     .set('Content-Type', 'application/json')
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql('Invalid email address!')
//                     })
//             })
//
//             it('should return status code 400 and message from invalid health_area', () => {
//                 return request
//                     .patch(`/users/healthprofessionals/${user.id}`)
//                     .send({ health_area: 'oncologist' })
//                     .set('Content-Type', 'application/json')
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql('Health Area not mapped!')
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql('The mapped areas are: nutrition, dentistry.')
//                     })
//             })
//
//             it('should return status code 400 and info message from try update password', () => {
//                 return request
//                     .patch(`/users/healthprofessionals/${user.id}`)
//                     .send({ password: user.password })
//                     .set('Content-Type', 'application/json')
//                     .expect(400)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql('This parameter could not be updated.')
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql('A specific route to update user password already exists.' +
//                             ` Access: PATCH /users/${user.id}/password to update your password.`)
//                     })
//             })
//         })
//
//         context('when the user is not found', () => {
//             it('should return status code 404 and message from user not found', () => {
//                 return request
//                     .patch(`/users/healthprofessionals/${new ObjectID()}`)
//                     .send({ email: user.email })
//                     .set('Content-Type', 'application/json')
//                     .expect(404)
//                     .then(res => {
//                         expect(res.body).to.have.property('message')
//                         expect(res.body.message).to.eql(Strings.HEALTH_PROFESSIONAL.NOT_FOUND)
//                         expect(res.body).to.have.property('description')
//                         expect(res.body.description).to.eql(Strings.HEALTH_PROFESSIONAL.NOT_FOUND_DESCRIPTION)
//                     })
//             })
//         })
//     })
//
//     describe('GET /users/healthprofessionals', () => {
//         context('when get all admin users', () => {
//             it('should return status code 200 and a list of users', () => {
//                 return request
//                     .get('/users/healthprofessionals')
//                     .set('Content-Type', 'application/json')
//                     .expect(200)
//                     .then(res => {
//                         expect(res.body).to.be.an.instanceof(Array)
//                         expect(res.body).to.have.lengthOf(1)
//                         expect(res.body[0]).to.have.property('id')
//                         expect(res.body[0].id).to.eql(user.id)
//                         expect(res.body[0]).to.have.property('email')
//                         expect(res.body[0].email).to.eql(user.email)
//                         expect(res.body[0]).to.have.property('name')
//                         expect(res.body[0].name).to.eql(user.name)
//                         expect(res.body[0]).to.have.property('health_area')
//                         expect(res.body[0].health_area).to.eql(user.health_area)
//                     })
//             })
//         })
//
//         context('when there no users', () => {
//             it('should return status code 200 and empty array', async () => {
//                 await deleteAllUsers({}).then()
//
//                 return request
//                     .get('/users/healthprofessionals')
//                     .set('Content-Type', 'application/json')
//                     .expect(200)
//                     .then(res => {
//                         expect(res.body).to.be.an.instanceof(Array)
//                         expect(res.body).to.have.lengthOf(0)
//                     })
//             })
//         })
//     })
// })
//
// async function deleteAllUsers(doc) {
//     return await UserRepoModel.deleteMany(doc)
// }
