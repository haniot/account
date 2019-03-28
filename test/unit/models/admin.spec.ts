import { assert } from 'chai'
import { Admin } from '../../../src/application/domain/model/admin'
import { DefaultEntityMock } from '../../mocks/default.entity.mock'
import { UserType } from '../../../src/application/domain/utils/user.type'

describe('Models: Admin', () => {
    describe('fromJSON()', () => {
        context('when pass a complete json', () => {
            it('should return a complete admin model', () => {
                const result = new Admin().fromJSON(DefaultEntityMock.ADMIN)
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', DefaultEntityMock.ADMIN.id)
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', UserType.ADMIN)
                assert.property(result, 'scopes')
                assert.property(result, 'email')
                assert.propertyVal(result, 'email', DefaultEntityMock.ADMIN.email)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', DefaultEntityMock.ADMIN.password)
            })
        })

        context('when does not pass a json', () => {
            it('should return a admin with some undefined parameters', () => {
                const result = new Admin().fromJSON(undefined)
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', undefined)
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', UserType.ADMIN)
                assert.property(result, 'scopes')
                assert.property(result, 'email')
                assert.propertyVal(result, 'email', undefined)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', undefined)
            })
        })

        context('when does pass a json as string', () => {
            it('should return a complete admin model', () => {
                const result = new Admin().fromJSON(JSON.stringify(DefaultEntityMock.ADMIN))
                assert.property(result, 'id')
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', UserType.ADMIN)
                assert.property(result, 'scopes')
                assert.property(result, 'email')
                assert.propertyVal(result, 'email', DefaultEntityMock.ADMIN.email)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', DefaultEntityMock.ADMIN.password)
            })

            it('should return a admin with some undefined parameters', () => {
                const result = new Admin().fromJSON('')
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', undefined)
                assert.property(result, 'type')
                assert.propertyVal(result, 'type', UserType.ADMIN)
                assert.property(result, 'scopes')
                assert.property(result, 'email')
                assert.propertyVal(result, 'email', undefined)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', undefined)
            })
        })
    })

    describe('toJSON()', () => {
        it('should return a admin as JSON', () => {
            const admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)
            const result = admin.toJSON()
            assert.property(result, 'id')
            assert.propertyVal(result, 'id', DefaultEntityMock.ADMIN.id)
            assert.property(result, 'type')
            assert.propertyVal(result, 'type', UserType.ADMIN)
            assert.property(result, 'email')
            assert.propertyVal(result, 'email', DefaultEntityMock.ADMIN.email)
        })
    })
})
