import { assert } from 'chai'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { Email } from '../../../src/application/domain/model/email'

describe('Models: Email', () => {
    describe('fromJSON()', () => {
        context('when pass a complete json', () => {
            it('should return a complete email model', () => {
                const result = new Email().fromJSON(DefaultEntityMock.EMAIL)
                assert.property(result, 'to', DefaultEntityMock.EMAIL.to)
                assert.property(result, 'action_url', DefaultEntityMock.EMAIL.action_url)
                assert.property(result, 'password', DefaultEntityMock.EMAIL.password)
                assert.property(result, 'lang', DefaultEntityMock.EMAIL.lang)
            })
        })

        context('when does not pass a json', () => {
            it('should return a email with some undefined parameters for undefined json', () => {
                const result = new Email().fromJSON(undefined)
                assert.property(result, 'to', undefined)
                assert.property(result, 'action_url', undefined)
                assert.property(result, 'password', undefined)
                assert.property(result, 'lang', undefined)
            })

            it('should return a email with some undefined parameters for empty json', () => {
                const result = new Email().fromJSON({})
                assert.property(result, 'to', undefined)
                assert.property(result, 'action_url', undefined)
                assert.property(result, 'password', undefined)
                assert.property(result, 'lang', undefined)
            })
        })

        context('when does pass a json as string', () => {
            it('should return a complete email model', () => {
                const result = new Email().fromJSON(JSON.stringify(DefaultEntityMock.EMAIL))
                assert.property(result, 'to', DefaultEntityMock.EMAIL.to)
                assert.property(result, 'action_url', DefaultEntityMock.EMAIL.action_url)
                assert.property(result, 'password', DefaultEntityMock.EMAIL.password)
                assert.property(result, 'lang', DefaultEntityMock.EMAIL.lang)
            })

            it('should return a email with some undefined parameters for empty string', () => {
                const result = new Email().fromJSON('')
                assert.property(result, 'to', undefined)
                assert.property(result, 'action_url', undefined)
                assert.property(result, 'password', undefined)
                assert.property(result, 'lang', undefined)
            })

            it('should return a email with some undefined parameters for invalid string', () => {
                const result = new Email().fromJSON('d52215d412')
                assert.property(result, 'to', undefined)
                assert.property(result, 'action_url', undefined)
                assert.property(result, 'password', undefined)
                assert.property(result, 'lang', undefined)
            })
        })
    })
})

describe('toJSON()', () => {
    it('should return a email as JSON', () => {
        const email = new Email().fromJSON(DefaultEntityMock.EMAIL)
        const result = email.toJSON()
        assert.property(result, 'to', DefaultEntityMock.EMAIL.to)
        assert.property(result, 'action_url', DefaultEntityMock.EMAIL.action_url)
        assert.property(result, 'password', DefaultEntityMock.EMAIL.password)
        assert.property(result, 'lang', DefaultEntityMock.EMAIL.lang)
    })
})
