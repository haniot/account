// import { assert } from 'chai'
// import sinon from 'sinon'
// import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
// import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
// import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
// import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
// import { UserRepositoryMock } from '../../mocks/repositories/user.repository.mock'
// import { HealthProfessionalRepository } from '../../../src/infrastructure/repository/health.professional.repository'
// import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
//
// require('sinon-mongoose')
//
// describe('Repositories: HealthProfessionalRepository', () => {
//     const modelFake: any = UserRepoModel
//     const repo =
//         new HealthProfessionalRepository(modelFake, new EntityMapperMock(), new UserRepositoryMock(), new CustomLoggerMock())
//     const user: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)
//
//     afterEach(() => {
//         sinon.restore()
//     })
//
//     describe('create()', () => {
//         context('when save a new health professional', () => {
//             it('should return a saved user', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('create')
//                     .withArgs(user)
//                     .resolves(user)
//
//                 return repo.create(user)
//                     .then(result => {
//                         assert.property(result, 'id')
//                         assert.propertyVal(result, 'id', user.id)
//                         assert.property(result, 'password')
//                         assert.propertyVal(result, 'password', user.password)
//                         assert.property(result, 'email')
//                         assert.propertyVal(result, 'email', user.email)
//                         assert.property(result, 'name')
//                         assert.propertyVal(result, 'name', user.name)
//                         assert.property(result, 'health_area')
//                         assert.propertyVal(result, 'health_area', user.health_area)
//                     })
//             })
//         })
//
//         context('when the password is not passed', () => {
//             it('should reject an error', () => {
//                 user.password = undefined
//                 sinon
//                     .mock(modelFake)
//                     .expects('create')
//                     .withArgs(user)
//                     .rejects({
//                         message: 'An internal error has occurred in the database!',
//                         description: 'Please try again later...'
//                     })
//                 return repo.create(user)
//                     .catch(err => {
//                         assert.property(err, 'message')
//                         assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
//                         assert.property(err, 'description')
//                         assert.propertyVal(err, 'description', 'Please try again later...')
//                     })
//             })
//         })
//     })
//
//     describe('checkExists()', () => {
//         context('when the parameter is a health professional', () => {
//             context('when check if a unique health professional exists', () => {
//                 it('should return true if exists', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: user.id, type: 'health_professional' })
//                         .chain('select')
//                         .chain('exec')
//                         .resolves(user)
//
//                     return repo.checkExists(user)
//                         .then(result => {
//                             assert.isBoolean(result)
//                             assert.isTrue(result)
//                         })
//                 })
//             })
//
//             context('when the health professional does not exists', () => {
//                 it('should return false', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: user.id, type: 'health_professional' })
//                         .chain('select')
//                         .chain('exec')
//                         .resolves(undefined)
//
//                     return repo.checkExists(user)
//                         .then(result => {
//                             assert.isBoolean(result)
//                             assert.isFalse(result)
//                         })
//                 })
//             })
//
//             context('when the health professional does not have id', () => {
//                 it('should reject an error', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: undefined, type: 'health_professional' })
//                         .chain('select')
//                         .chain('exec')
//                         .resolves(undefined)
//
//                     user.id = undefined
//                     return repo.checkExists(user)
//                         .catch(err => {
//                             assert.property(err, 'message')
//                             assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
//                             assert.property(err, 'description')
//                             assert.propertyVal(err, 'description', 'Please try again later...')
//                             user.id = DefaultEntityMock.HEALTH_PROFESSIONAL.id
//                         })
//                 })
//             })
//
//             context('when there are a database error', () => {
//                 it('should reject an error', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: user.id, type: 'health_professional' })
//                         .chain('select')
//                         .chain('exec')
//                         .rejects({ message: 'An internal error has occurred in the database!' })
//
//                     return repo.checkExists(user)
//                         .catch(err => {
//                             assert.property(err, 'message')
//                             assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
//                             assert.property(err, 'description')
//                             assert.propertyVal(err, 'description', 'Please try again later...')
//                         })
//                 })
//             })
//         })
//
//         context('when the parameter is a array of health professional', () => {
//             context('when the health professionals exists', () => {
//                 it('should return true', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: user.id, type: 'health_professional' })
//                         .chain('select')
//                         .chain('exec')
//                         .resolves(user)
//
//                     return repo.checkExists([user])
//                         .then(result => {
//                             assert.isBoolean(result)
//                             assert.isTrue(result)
//                         })
//                 })
//             })
//
//             context('when the health professionals list is empty', () => {
//                 it('should return false', () => {
//                     return repo.checkExists([])
//                         .then(result => {
//                             assert.isBoolean(result)
//                             assert.isFalse(result)
//                         })
//                 })
//             })
//
//             context('when the health professional does not exists', () => {
//                 it('should return false', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: user.id, type: 'health_professional' })
//                         .chain('select')
//                         .chain('exec')
//                         .resolves(undefined)
//
//                     return repo.checkExists([user])
//                         .then(result => {
//                             assert.property(result, 'message')
//                             assert.propertyVal(result, 'message', user.id)
//                         })
//                 })
//             })
//
//             context('when the health professional does not have id', () => {
//                 it('should reject an error', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: undefined, type: 'health_professional' })
//                         .chain('select')
//                         .chain('exec')
//                         .resolves(undefined)
//
//                     user.id = undefined
//                     return repo.checkExists([user])
//                         .catch(err => {
//                             assert.property(err, 'message')
//                             assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
//                             assert.property(err, 'description')
//                             assert.propertyVal(err, 'description', 'Please try again later...')
//                             user.id = DefaultEntityMock.HEALTH_PROFESSIONAL.id
//                         })
//                 })
//             })
//
//             context('when there are a database error', () => {
//                 it('should reject an error', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: user.id, type: 'health_professional' })
//                         .chain('select')
//                         .chain('exec')
//                         .rejects({ message: 'An internal error has occurred in the database!' })
//
//                     return repo.checkExists([user])
//                         .catch(err => {
//                             assert.property(err, 'message')
//                             assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
//                             assert.property(err, 'description')
//                             assert.propertyVal(err, 'description', 'Please try again later...')
//                         })
//                 })
//             })
//         })
//     })
// })
