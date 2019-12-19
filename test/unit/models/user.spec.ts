import { assert } from 'chai'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { User } from '../../../src/application/domain/model/user'

describe('Models: User', () => {
    describe('addScope()', () => {
        context('when add a scope from user', () => {
            const user: User = new User().fromJSON(DefaultEntityMock.USER)
            user.addScope('all')
            user.addScope('any')
            assert.lengthOf(user.scopes, 2)
        })

        context('when the scope array from user is undefined', () => {
            it('should set scopes as new array and add the scope', () => {
                const user: User = new User()
                user.addScope('any')
                assert.lengthOf(user.scopes, 1)
            })
        })

        context('when pass a empty scope', () => {
            it('should not add a scope', () => {
                const user: User = new User()
                user.addScope(undefined!)
                assert.lengthOf(user.scopes, 0)
            })
        })
    })

    describe('removeScope()', () => {
        context('when remove a scope', () => {
            it('should remove a scope from user', () => {
                const user: User = new User()
                user.addScope('any')
                assert.lengthOf(user.scopes, 1)
                user.removeScope('any')
                assert.lengthOf(user.scopes, 0)
            })
        })

        context('when try remove a null scope', () => {
            it('should do nothing', () => {
                const user: User = new User()
                user.addScope('any')
                assert.lengthOf(user.scopes, 1)
                user.removeScope(undefined!)
                assert.lengthOf(user.scopes, 1)
            })
        })
    })

    describe('convertDatetimeString()', () => {
        const user: User = new User()
        context('when the param is a date string in iso format', () => {
            it('should return a new date', () => {
                const date = user.convertDatetimeString('2019-04-09T00:01:02')
                assert.equal(typeof date, 'object')
            })
        })
        context('when the param is a date but is not a string', () => {
            it('should return a new date', () => {
                const date = user.convertDatetimeString(new Date())
                assert.equal(typeof date, 'object')
            })
        })
    })

    describe('fromJSON()', () => {
        context('when pass a complete json', () => {
            it('should return a complete user model', () => {
                const result = new User().fromJSON(DefaultEntityMock.USER)
                result.email_verified = DefaultEntityMock.USER.email_verified
                result.change_password = DefaultEntityMock.USER.change_password
                assert.property(result, 'id')
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', DefaultEntityMock.USER.email)
                assert.propertyVal(result, 'password', DefaultEntityMock.USER.password)
                assert.propertyVal(result, 'birth_date', DefaultEntityMock.USER.birth_date)
                assert.propertyVal(result, 'phone_number', DefaultEntityMock.USER.phone_number)
                assert.propertyVal(result, 'selected_pilot_study', DefaultEntityMock.USER.selected_pilot_study)
                assert.propertyVal(result, 'language', DefaultEntityMock.USER.language)
                assert.propertyVal(result, 'email_verified', DefaultEntityMock.USER.email_verified)
                assert.propertyVal(result, 'change_password', DefaultEntityMock.USER.change_password)
            })
        })

        context('when does not pass a json', () => {
            it('should return a user with some undefined parameters for undefined json', () => {
                const result = new User().fromJSON(undefined)
                assert.propertyVal(result, 'id', undefined)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
            })

            it('should return a user with some undefined parameters for empty json', () => {
                const result = new User().fromJSON({})
                assert.propertyVal(result, 'id', undefined)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'scopes', undefined)
                assert.propertyVal(result, 'scopes', undefined)
            })
        })

        context('when does pass a json as string', () => {
            it('should return a complete user model', () => {
                const result = new User().fromJSON(JSON.stringify(DefaultEntityMock.USER))
                assert.property(result, 'id')
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', DefaultEntityMock.USER.email)
                assert.propertyVal(result, 'password', DefaultEntityMock.USER.password)
                assert.propertyVal(result, 'birth_date', DefaultEntityMock.USER.birth_date)
                assert.propertyVal(result, 'phone_number', DefaultEntityMock.USER.phone_number)
                assert.propertyVal(result, 'selected_pilot_study', DefaultEntityMock.USER.selected_pilot_study)
                assert.propertyVal(result, 'language', DefaultEntityMock.USER.language)
            })

            it('should return a user with some undefined parameters for empty string', () => {
                const result = new User().fromJSON('')
                assert.propertyVal(result, 'id', undefined)
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'scopes', undefined)
            })

            it('should return a user with some undefined parameters for invalid string', () => {
                const result = new User().fromJSON('d52215d412')
                assert.property(result, 'scopes')
                assert.propertyVal(result, 'email', undefined)
                assert.propertyVal(result, 'password', undefined)
                assert.propertyVal(result, 'birth_date', undefined)
                assert.propertyVal(result, 'phone_number', undefined)
                assert.propertyVal(result, 'selected_pilot_study', undefined)
                assert.propertyVal(result, 'scopes', undefined)
            })
        })
    })

    describe('toJSON()', () => {
        it('should return a user as JSON', () => {
            const user = new User().fromJSON(DefaultEntityMock.USER)
            const result = user.toJSON()
            assert.property(result, 'id')
            assert.propertyVal(result, 'email', DefaultEntityMock.USER.email)
            assert.propertyVal(result, 'birth_date', DefaultEntityMock.USER.birth_date)
            assert.propertyVal(result, 'phone_number', DefaultEntityMock.USER.phone_number)
            assert.propertyVal(result, 'selected_pilot_study', DefaultEntityMock.USER.selected_pilot_study)
            assert.propertyVal(result, 'language', DefaultEntityMock.USER.language)
        })
    })

})
