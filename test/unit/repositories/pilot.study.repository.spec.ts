import { assert } from 'chai'
import sinon from 'sinon'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
import { PilotStudyRepoModel } from '../../../src/infrastructure/database/schema/pilot.study.schema'
import { PilotStudyRepository } from '../../../src/infrastructure/repository/pilot.study.repository'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'

require('sinon-mongoose')

describe('Repositories: PilotStudyRepository', () => {
    const modelFake: any = PilotStudyRepoModel
    const repo =
        new PilotStudyRepository(modelFake, new EntityMapperMock(), new CustomLoggerMock())
    const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)

    afterEach(() => {
        sinon.restore()
    })

    describe('checkExists()', () => {
        context('when the parameter is a pilot study', () => {
            context('when check if a unique pilot study exists', () => {
                it('should return true if exists', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: pilot.id })
                        .chain('select')
                        .chain('exec')
                        .resolves(pilot)

                    return repo.checkExists(pilot)
                        .then(result => {
                            assert.isBoolean(result)
                            assert.isTrue(result)
                        })
                })
            })

            context('when the pilot study does not exists', () => {
                it('should return false', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: pilot.id })
                        .chain('select')
                        .chain('exec')
                        .resolves(undefined)

                    return repo.checkExists(pilot)
                        .then(result => {
                            assert.isBoolean(result)
                            assert.isFalse(result)
                        })
                })
            })

            context('when the pilot study does not have id', () => {
                it('should reject an error', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: undefined })
                        .chain('select')
                        .chain('exec')
                        .resolves(undefined)

                    pilot.id = undefined
                    return repo.checkExists(pilot)
                        .catch(err => {
                            assert.property(err, 'message')
                            assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                            assert.property(err, 'description')
                            assert.propertyVal(err, 'description', 'Please try again later...')
                            pilot.id = DefaultEntityMock.PILOT_STUDY.id
                        })
                })
            })

            context('when the pilot study does not have name', () => {
                it('should reject an error', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: undefined })
                        .chain('select')
                        .chain('exec')
                        .resolves(undefined)

                    pilot.id = undefined
                    pilot.name = undefined
                    return repo.checkExists(pilot)
                        .catch(err => {
                            assert.property(err, 'message')
                            assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                            assert.property(err, 'description')
                            assert.propertyVal(err, 'description', 'Please try again later...')
                            pilot.id = DefaultEntityMock.PILOT_STUDY.id
                            pilot.name = DefaultEntityMock.PILOT_STUDY.name
                        })
                })
            })

            context('when there are a database error', () => {
                it('should reject an error', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: pilot.id })
                        .chain('select')
                        .chain('exec')
                        .rejects({ message: 'An internal error has occurred in the database!' })

                    return repo.checkExists(pilot)
                        .catch(err => {
                            assert.property(err, 'message')
                            assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                            assert.property(err, 'description')
                            assert.propertyVal(err, 'description', 'Please try again later...')
                        })
                })
            })
        })

        context('when the parameter is a array of pilot study', () => {
            context('when the pilot studys exists', () => {
                it('should return true', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: pilot.id })
                        .chain('select')
                        .chain('exec')
                        .resolves(pilot)

                    return repo.checkExists([pilot])
                        .then(result => {
                            assert.isBoolean(result)
                            assert.isTrue(result)
                        })
                })
            })

            context('when the pilot studys list is empty', () => {
                it('should return false', () => {
                    return repo.checkExists([])
                        .then(result => {
                            assert.isBoolean(result)
                            assert.isFalse(result)
                        })
                })
            })

            context('when the pilot study does not exists', () => {
                it('should return false', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: pilot.id })
                        .chain('select')
                        .chain('exec')
                        .resolves(undefined)

                    return repo.checkExists([pilot])
                        .then(result => {
                            assert.property(result, 'message')
                            assert.propertyVal(result, 'message', pilot.id)
                        })
                })
            })

            context('when the pilot study does not have id', () => {
                it('should reject an error', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: undefined })
                        .chain('select')
                        .chain('exec')
                        .resolves(undefined)

                    pilot.id = undefined
                    return repo.checkExists([pilot])
                        .catch(err => {
                            assert.property(err, 'message')
                            assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                            assert.property(err, 'description')
                            assert.propertyVal(err, 'description', 'Please try again later...')
                            pilot.id = DefaultEntityMock.PILOT_STUDY.id
                        })
                })
            })

            context('when the pilot study does not have name', () => {
                it('should reject an error', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: undefined })
                        .chain('select')
                        .chain('exec')
                        .resolves(undefined)

                    pilot.id = undefined
                    pilot.name = undefined
                    return repo.checkExists([pilot])
                        .catch(err => {
                            assert.property(err, 'message')
                            assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                            assert.property(err, 'description')
                            assert.propertyVal(err, 'description', 'Please try again later...')
                            pilot.id = DefaultEntityMock.PILOT_STUDY.id
                            pilot.name = DefaultEntityMock.PILOT_STUDY.name
                        })
                })
            })

            context('when there are a database error', () => {
                it('should reject an error', () => {
                    sinon
                        .mock(modelFake)
                        .expects('findOne')
                        .withArgs({ _id: pilot.id })
                        .chain('select')
                        .chain('exec')
                        .rejects({ message: 'An internal error has occurred in the database!' })

                    return repo.checkExists([pilot])
                        .catch(err => {
                            assert.property(err, 'message')
                            assert.propertyVal(err, 'message', 'An internal error has occurred in the database!')
                            assert.property(err, 'description')
                            assert.propertyVal(err, 'description', 'Please try again later...')
                        })
                })
            })
        })
    })
})
