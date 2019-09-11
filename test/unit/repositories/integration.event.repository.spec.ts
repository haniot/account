import sinon from 'sinon'
import { assert } from 'chai'
import { IntegrationEventRepoModel } from '../../../src/infrastructure/database/schema/integration.event.schema'
import { IntegrationEventRepository } from '../../../src/infrastructure/repository/integration.event.repository'
import { Query } from '../../../src/infrastructure/repository/query/query'

require('sinon-mongoose')

describe('Repositories: IntegrationEventRepository', () => {
    const modelFake: any = IntegrationEventRepoModel
    const repo = new IntegrationEventRepository(modelFake)
    const object: any = { type: 'any', id: '123' }
    afterEach(() => {
        sinon.restore()
    })

    describe('create()', () => {
        context('when save a new object', () => {
            it('should return the saved object', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(object)
                    .resolves(object)

                return repo.create(object)
                    .then(result => {
                        assert.propertyVal(result, 'type', object.type)
                        assert.propertyVal(result, 'id', object.id)
                    })
            })
        })

        context('when the object is not saved', () => {
            it('should return undefined', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(object)
                    .resolves(undefined)

                return repo.create(object)
                    .then(result => {
                        assert.isUndefined(result)
                    })
            })
        })

        context('when there are database errors', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('create')
                    .withArgs(object)
                    .rejects({ message: 'Any message' })

                return repo.create(object)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Any message')
                    })
            })
        })

    })

    describe('find()', () => {
        context('when get a collection of event', () => {
            it('should return a list', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .withArgs({})
                    .chain('sort')
                    .chain('exec')
                    .resolves([object])

                return repo.find(new Query())
                    .then(res => {
                        assert.isArray(res)
                        assert.lengthOf(res, 1)
                        assert.propertyVal(res[0], 'type', 'any')
                    })
            })
        })

        context('when there are database errors', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('find')
                    .withArgs({})
                    .chain('sort')
                    .chain('exec')
                    .rejects({ message: 'Any message' })

                return repo.find(new Query())
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Any message')
                    })
            })
        })
    })

    describe('delete()', () => {
        context('when delete an event', () => {
            it('should return true', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ _id: object.id })
                    .chain('exec')
                    .resolves(true)

                return repo.delete(object.id)
                    .then(res => {
                        assert.isTrue(res)
                    })
            })
        })

        context('when event is not deleted', () => {
            it('should return false', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ _id: object.id })
                    .chain('exec')
                    .resolves(false)

                return repo.delete(object.id)
                    .then(res => {
                        assert.isFalse(res)
                    })
            })
        })

        context('when there are database errors', () => {
            it('should reject a error', () => {
                sinon
                    .mock(modelFake)
                    .expects('findOneAndDelete')
                    .withArgs({ _id: object.id })
                    .chain('exec')
                    .rejects({ message: 'Any message' })

                return repo.delete(object.id)
                    .catch(err => {
                        assert.propertyVal(err, 'message', 'Any message')
                    })
            })
        })
    })

    describe('findOne()', () => {
        context('when call this method', () => {
            it('should throw an error for not implemented', () => {
                try {
                    repo.findOne(new Query())
                } catch (err) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })

    describe('update()', () => {
        context('when call this method', () => {
            it('should throw an error for not implemented', () => {
                try {
                    repo.update({})
                } catch (err) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })

    describe('count()', () => {
        context('when call this method', () => {
            it('should throw an error for not implemented', () => {
                try {
                    repo.count(new Query())
                } catch (err) {
                    assert.propertyVal(err, 'message', 'Not implemented!')
                }
            })
        })
    })
})
