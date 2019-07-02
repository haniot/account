// import { assert } from 'chai'
// import sinon from 'sinon'
// import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
// import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
// import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
// import { PilotStudyRepoModel } from '../../../src/infrastructure/database/schema/pilot.study.schema'
// import { PilotStudyRepository } from '../../../src/infrastructure/repository/pilot.study.repository'
// import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
// import { Query } from '../../../src/infrastructure/repository/query/query'
//
// require('sinon-mongoose')
//
// describe('Repositories: PilotStudyRepository', () => {
//     const modelFake: any = PilotStudyRepoModel
//     const repo =
//         new PilotStudyRepository(modelFake, new EntityMapperMock(), new CustomLoggerMock())
//     const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
//
//     afterEach(() => {
//         sinon.restore()
//     })
//
//     describe('create()', () => {
//         context('when save a pilot study', () => {
//             it('should return the saved pilot study', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('create')
//                     .withArgs(pilot)
//                     .resolves(pilot)
//
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOne')
//                     .withArgs({ _id: pilot.id })
//                     .chain('select')
//                     .chain('exec')
//                     .resolves(pilot)
//
//                 return repo.create(pilot)
//                     .then(result => {
//                         assert.propertyVal(result, 'name', pilot.name)
//                         assert.propertyVal(result, 'is_active', pilot.is_active)
//                         assert.propertyVal(result, 'start', pilot.start)
//                         assert.propertyVal(result, 'end', pilot.end)
//                         assert.deepPropertyVal(result, 'health_professionals_id', pilot.health_professionals_id)
//                     })
//             })
//         })
//
//         context('when the pilot is not saved', () => {
//             it('should return undefined', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('create')
//                     .withArgs(pilot)
//                     .resolves(undefined)
//
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOne')
//                     .withArgs({ _id: pilot.id })
//                     .chain('select')
//                     .chain('exec')
//                     .resolves(undefined)
//
//                 return repo.create(pilot)
//                     .then(result => {
//                         assert.equal(result, undefined)
//                     })
//             })
//         })
//
//         context('when a database error occurs', () => {
//             it('should reject a error', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('create')
//                     .withArgs(pilot)
//                     .chain('exec')
//                     .rejects({ message: 'An internal error has occurred in the database!' })
//
//                 return repo.create(pilot)
//                     .catch(err => {
//                         assert.property(err, 'name')
//                         assert.propertyVal(err, 'name', 'Error')
//                         assert.property(err, 'message')
//                         assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
//                     })
//             })
//         })
//
//     })
//
//     describe('find()', () => {
//         context('when want get all pilot studies', () => {
//             it('should return a list of pilot studies', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('find')
//                     .chain('select')
//                     .chain('sort')
//                     .chain('skip')
//                     .chain('limit')
//                     .chain('populate')
//                     .chain('exec')
//                     .resolves([pilot])
//
//                 return repo.find(new Query().fromJSON({
//                     filters: { 'health_professionals_id.name': pilot.name },
//                     fields: {
//                         'health_professionals_id.name': 1,
//                         'health_professionals_id.is_active': 1,
//                         'health_professionals_id.start': 1,
//                         'health_professionals_id.end': 1
//                     }
//                 })).then(result => {
//                     assert.isArray(result)
//                     assert.lengthOf(result, 1)
//                     assert.propertyVal(result[0], 'name', pilot.name)
//                     assert.propertyVal(result[0], 'is_active', pilot.is_active)
//                     assert.propertyVal(result[0], 'start', pilot.start)
//                     assert.propertyVal(result[0], 'end', pilot.end)
//                     assert.deepPropertyVal(result[0], 'health_professionals_id', pilot.health_professionals_id)
//                 })
//             })
//         })
//
//         context('when there are no measurements', () => {
//             it('should return empty array', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('find')
//                     .chain('select')
//                     .chain('sort')
//                     .chain('skip')
//                     .chain('limit')
//                     .chain('populate')
//                     .chain('exec')
//                     .resolves([])
//
//                 return repo.find(new Query())
//                     .then(result => {
//                         assert.isArray(result)
//                         assert.lengthOf(result, 0)
//                     })
//             })
//         })
//
//         context('when a database error occurs', () => {
//             it('should reject a error', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('find')
//                     .chain('select')
//                     .chain('sort')
//                     .chain('skip')
//                     .chain('limit')
//                     .chain('populate')
//                     .chain('exec')
//                     .rejects({ message: 'An internal error has occurred in the database!' })
//
//                 return repo.find(new Query())
//                     .catch(err => {
//                         assert.propertyVal(err, 'name', 'Error')
//                         assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
//                     })
//             })
//         })
//     })
//
//     describe('findOne()', () => {
//         context('when get a unique pilot study', () => {
//             it('should return a pilot study', () => {
//                 const query = new Query().fromJSON({
//                     fields: {
//                         'health_professionals_id.name': 1,
//                         'health_professionals_id.is_active': 1,
//                         'health_professionals_id.start': 1,
//                         'health_professionals_id.end': 1
//                     }
//                 })
//
//                 query.addFilter({ _id: pilot.id })
//
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOne')
//                     .withArgs({ _id: pilot.id })
//                     .chain('select')
//                     .chain('populate')
//                     .chain('exec')
//                     .resolves(pilot)
//
//                 return repo.findOne(query)
//                     .then(result => {
//                         assert.propertyVal(result, 'name', pilot.name)
//                         assert.propertyVal(result, 'is_active', pilot.is_active)
//                         assert.propertyVal(result, 'start', pilot.start)
//                         assert.propertyVal(result, 'end', pilot.end)
//                         assert.deepPropertyVal(result, 'health_professionals_id', pilot.health_professionals_id)
//                     })
//             })
//         })
//
//         context('when the pilot study is not found', () => {
//             it('should return undefined', () => {
//                 const query = new Query()
//                 query.addFilter({ _id: pilot.id })
//
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOne')
//                     .withArgs({ _id: pilot.id })
//                     .chain('select')
//                     .chain('populate')
//                     .chain('exec')
//                     .resolves(undefined)
//
//                 return repo.findOne(query)
//                     .then(result => {
//                         assert.equal(result, undefined)
//                     })
//             })
//         })
//
//         context('when a database error occurs', () => {
//             it('should reject a error', () => {
//                 const query = new Query()
//                 query.addFilter({ _id: pilot.id })
//
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOne')
//                     .withArgs({ _id: pilot.id })
//                     .chain('select')
//                     .chain('populate')
//                     .chain('exec')
//                     .rejects({ message: 'An internal error has occurred in the database!' })
//
//                 return repo.findOne(query)
//                     .catch(err => {
//                         assert.propertyVal(err, 'name', 'Error')
//                         assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
//                     })
//             })
//         })
//
//     })
//
//     describe('update()', () => {
//         context('when update a pilot study', () => {
//             it('should return the updated pilot study', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOneAndUpdate')
//                     .withArgs({ _id: pilot.id }, pilot, { new: true })
//                     .chain('populate')
//                     .chain('exec')
//                     .resolves(pilot)
//
//                 return repo.update(pilot)
//                     .then(result => {
//                         assert.propertyVal(result, 'name', pilot.name)
//                         assert.propertyVal(result, 'is_active', pilot.is_active)
//                         assert.propertyVal(result, 'start', pilot.start)
//                         assert.propertyVal(result, 'end', pilot.end)
//                         assert.deepPropertyVal(result, 'health_professionals_id', pilot.health_professionals_id)
//                     })
//             })
//         })
//
//         context('when the pilot study is not found', () => {
//             it('should return undefined', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOneAndUpdate')
//                     .withArgs({ _id: pilot.id }, pilot, { new: true })
//                     .chain('populate')
//                     .chain('exec')
//                     .resolves(undefined)
//
//                 return repo.update(pilot)
//                     .then(result => {
//                         assert.equal(result, undefined)
//                     })
//             })
//         })
//
//         context('when a database error occurs', () => {
//             it('should reject a error', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOneAndUpdate')
//                     .withArgs({ _id: pilot.id }, pilot, { new: true })
//                     .chain('populate')
//                     .chain('exec')
//                     .rejects({ message: 'An internal error has occurred in the database!' })
//
//                 return repo.update(pilot)
//                     .catch(err => {
//                         assert.propertyVal(err, 'name', 'Error')
//                         assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
//                     })
//             })
//         })
//     })
//
//     describe('checkExists()', () => {
//         context('when the parameter is a pilot study', () => {
//             context('when check if a unique pilot study exists', () => {
//                 it('should return true if exists', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: pilot.id })
//                         .chain('select')
//                         .chain('exec')
//                         .resolves(pilot)
//
//                     return repo.checkExists(pilot)
//                         .then(result => {
//                             assert.isBoolean(result)
//                             assert.isTrue(result)
//                         })
//                 })
//             })
//
//             context('when the pilot study does not exists', () => {
//                 it('should return false', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: pilot.id })
//                         .chain('select')
//                         .chain('exec')
//                         .resolves(undefined)
//
//                     return repo.checkExists(pilot)
//                         .then(result => {
//                             assert.isBoolean(result)
//                             assert.isFalse(result)
//                         })
//                 })
//             })
//
//             context('when the pilot study does not have id', () => {
//                 it('should reject an error', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: undefined })
//                         .chain('select')
//                         .chain('exec')
//                         .resolves(undefined)
//
//                     pilot.id = undefined
//                     return repo.checkExists(pilot)
//                         .catch(err => {
//                             assert.property(err, 'message')
//                             assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
//                             assert.property(err, 'description')
//                             assert.propertyVal(err, 'description', 'Please try again later...')
//                             pilot.id = DefaultEntityMock.PILOT_STUDY.id
//                         })
//                 })
//             })
//
//             context('when the pilot study does not have name', () => {
//                 it('should reject an error', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: undefined })
//                         .chain('select')
//                         .chain('exec')
//                         .resolves(undefined)
//
//                     pilot.id = undefined
//                     pilot.name = undefined
//                     return repo.checkExists(pilot)
//                         .catch(err => {
//                             assert.property(err, 'message')
//                             assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
//                             assert.property(err, 'description')
//                             assert.propertyVal(err, 'description', 'Please try again later...')
//                             pilot.id = DefaultEntityMock.PILOT_STUDY.id
//                             pilot.name = DefaultEntityMock.PILOT_STUDY.name
//                         })
//                 })
//             })
//
//             context('when there are a database error', () => {
//                 it('should reject an error', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: pilot.id })
//                         .chain('select')
//                         .chain('exec')
//                         .rejects({ message: 'An internal error has occurred in the database!' })
//
//                     return repo.checkExists(pilot)
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
//         context('when the parameter is a array of pilot study', () => {
//             context('when the pilot studys exists', () => {
//                 it('should return true', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: pilot.id })
//                         .chain('select')
//                         .chain('exec')
//                         .resolves(pilot)
//
//                     return repo.checkExists([pilot])
//                         .then(result => {
//                             assert.isBoolean(result)
//                             assert.isTrue(result)
//                         })
//                 })
//             })
//
//             context('when the pilot studys list is empty', () => {
//                 it('should return false', () => {
//                     return repo.checkExists([])
//                         .then(result => {
//                             assert.isBoolean(result)
//                             assert.isFalse(result)
//                         })
//                 })
//             })
//
//             context('when the pilot study does not exists', () => {
//                 it('should return false', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: pilot.id })
//                         .chain('select')
//                         .chain('exec')
//                         .resolves(undefined)
//
//                     return repo.checkExists([pilot])
//                         .then(result => {
//                             assert.property(result, 'message')
//                             assert.propertyVal(result, 'message', pilot.id)
//                         })
//                 })
//             })
//
//             context('when the pilot study does not have id', () => {
//                 it('should reject an error', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: undefined })
//                         .chain('select')
//                         .chain('exec')
//                         .resolves(undefined)
//
//                     pilot.id = undefined
//                     return repo.checkExists([pilot])
//                         .catch(err => {
//                             assert.property(err, 'message')
//                             assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
//                             assert.property(err, 'description')
//                             assert.propertyVal(err, 'description', 'Please try again later...')
//                             pilot.id = DefaultEntityMock.PILOT_STUDY.id
//                         })
//                 })
//             })
//
//             context('when the pilot study does not have name', () => {
//                 it('should reject an error', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: undefined })
//                         .chain('select')
//                         .chain('exec')
//                         .resolves(undefined)
//
//                     pilot.id = undefined
//                     pilot.name = undefined
//                     return repo.checkExists([pilot])
//                         .catch(err => {
//                             assert.property(err, 'message')
//                             assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
//                             assert.property(err, 'description')
//                             assert.propertyVal(err, 'description', 'Please try again later...')
//                             pilot.id = DefaultEntityMock.PILOT_STUDY.id
//                             pilot.name = DefaultEntityMock.PILOT_STUDY.name
//                         })
//                 })
//             })
//
//             context('when there are a database error', () => {
//                 it('should reject an error', () => {
//                     sinon
//                         .mock(modelFake)
//                         .expects('findOne')
//                         .withArgs({ _id: pilot.id })
//                         .chain('select')
//                         .chain('exec')
//                         .rejects({ message: 'An internal error has occurred in the database!' })
//
//                     return repo.checkExists([pilot])
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
