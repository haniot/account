import { assert } from 'chai'
import { User } from '../../../src/application/domain/model/user'

describe('Models: User', () => {
    const user = {
        id: '5ca4b464620630ade4ec517c',
        username: 'user',
        password: 'user123',
        scopes: ['none']
    }

    const userNew = new User().fromJSON(user)

    describe('fromJSON()', () => {
        context('when pass a complete json', () => {
            it('should return a complete user model', () => {
                const result = new User().fromJSON(user)
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', user.id)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', user.password)
                assert.property(result, 'scopes')
                assert.deepPropertyVal(result, 'scopes', user.scopes)
            })
        })

        context('when does not pass a json', () => {
            it('should return a user with some undefined parameters', () => {
                const result = new User().fromJSON(undefined)
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', undefined)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', undefined)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'scopes', undefined)
            })
        })

        context('when does pass a json as string', () => {
            it('should return a complete user model', () => {
                const result = new User().fromJSON(JSON.stringify(user))
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', user.id)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', user.password)
                assert.property(result, 'scopes')
                assert.deepPropertyVal(result, 'scopes', user.scopes)
            })

            it('should return a user with some undefined parameters for empty string', () => {
                const result = new User().fromJSON('')
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', undefined)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', undefined)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'scopes', undefined)
            })
        })

        context('when does pass a json as empty json', () => {
            it('should return a user with some undefined parameters', () => {
                const result = new User().fromJSON({})
                assert.property(result, 'id')
                assert.propertyVal(result, 'id', undefined)
                assert.property(result, 'password')
                assert.propertyVal(result, 'password', undefined)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'scopes', undefined)
            })
        })
    })

    describe('toJSON()', () => {
        it('should return a user as JSON', () => {
            const result = userNew.toJSON()
            assert.property(result, 'id')
            assert.propertyVal(result, 'id', user.id)
        })
    })

    describe('addScope()', () => {
        context('when add a scopes', () => {
            it('should add a scopes in user scopes', () => {
                userNew.addScope('anyone')
                assert.lengthOf(userNew.scopes!, 2)
            })
        })

        context('when add a undefined scopes', () => {
            it('should ignore a scopes', () => {
                userNew.addScope(undefined!)
                assert.lengthOf(userNew.scopes!, 2)
            })
        })

        context('when the user scopes is undefined', () => {
            it('should create a empty array before add scopes', () => {
                const userWithoutScope: User = new User()
                userWithoutScope.addScope('none')
                assert.lengthOf(userWithoutScope.scopes!, 1)
            })
        })

    })

    describe('removeScope()', () => {
        context('when remove a scopes', () => {
            it('should remove a scopes from user scopes', () => {
                userNew.removeScope('none')
                assert.lengthOf(userNew.scopes!, 1)
            })
        })
    })
})
