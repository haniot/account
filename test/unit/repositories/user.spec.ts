// import { assert } from 'chai'
// import sinon from 'sinon'
// import { UserRepository } from '../../../src/infrastructure/repository/user.repository'
// import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
// import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
// import { Admin } from '../../../src/application/domain/model/admin'
// import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
// import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
// import { Strings } from '../../../src/utils/strings'
//
// require('sinon-mongoose')
//
// describe('Repositories: User', () => {
//
//     const modelFake: any = UserRepoModel
//     const repo = new UserRepository(modelFake, new EntityMapperMock(), new CustomLoggerMock())
//     const user: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)
//
//     afterEach(() => {
//         sinon.restore()
//     })
//
//     describe('checkExists()', () => {
//         context('when the search done by email is successful', () => {
//             it('should return true', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOne')
//                     .withArgs({ email: user.email })
//                     .chain('exec')
//                     .resolves(user)
//
//                 return repo.checkExist(user.email)
//                     .then(result => {
//                         assert.isBoolean(result)
//                         assert.isTrue(result)
//                     })
//             })
//         })
//
//         context('when user is not founded by email', () => {
//             it('should return false', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOne')
//                     .withArgs({ email: 'unknown@mail.com' })
//                     .chain('exec')
//                     .resolves(undefined)
//
//                 return repo.checkExist('unknown@mail.com')
//                     .then(result => {
//                         assert.isBoolean(result)
//                         assert.isFalse(result)
//                     })
//             })
//         })
//
//         context('when a database error occurs', () => {
//             it('should reject a error', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOne')
//                     .withArgs(undefined)
//                     .chain('exec')
//                     .rejects({ message: 'An internal error has occurred in the database!' })
//
//                 return repo.checkExist(undefined)
//                     .catch(err => {
//                         assert.equal(err.message, 'An internal error has occurred in the database!')
//                         assert.equal(err.description, 'Please try again later...')
//                     })
//             })
//         })
//     })
//
//     describe('changePassword()', () => {
//         const anotherUser: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)
//         anotherUser.password = repo.encryptPassword(anotherUser.password)
//         anotherUser.change_password = true
//
//         context('when password is changed', () => {
//             it('should return true', () => {
//
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOne')
//                     .withArgs({ _id: user.id })
//                     .resolves(anotherUser)
//
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOneAndUpdate')
//                     .withArgs({ _id: user.id }, anotherUser, { new: true })
//                     .resolves(anotherUser)
//
//                 return repo.changePassword(user.id!, user.password!, user.password!)
//                     .then(result => {
//                         assert.isBoolean(result)
//                         assert.isTrue(result)
//                     })
//             })
//         })
//
//         context('when user is not found', () => {
//             it('should return false', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOne')
//                     .withArgs({ _id: user.id })
//                     .resolves(undefined)
//
//                 return repo.changePassword(user.id!, user.password!, user.password!)
//                     .then(result => {
//                         assert.isBoolean(result)
//                         assert.isFalse(result)
//                     })
//             })
//         })
//
//         context('when the password does not match', () => {
//             it('should return error for password does not match', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOne')
//                     .withArgs({ _id: user.id })
//                     .resolves(user)
//
//                 return repo.changePassword(user.id!, user.password!, user.password!)
//                     .catch(err => {
//                         assert.property(err, 'message')
//                         assert.property(err, 'description')
//                         assert.equal(err.message, Strings.USER.PASSWORD_NOT_MATCH)
//                         assert.equal(err.description, Strings.USER.PASSWORD_NOT_MATCH_DESCRIPTION)
//                     })
//             })
//         })
//
//         context('when does not update password', () => {
//             it('should return false', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOne')
//                     .withArgs({ _id: user.id })
//                     .resolves(anotherUser)
//
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOneAndUpdate')
//                     .withArgs({ _id: user.id }, anotherUser, { new: true })
//                     .resolves(undefined)
//
//                 return repo.changePassword(user.id!, user.password!, user.password!)
//                     .then(result => {
//                         assert.isBoolean(result)
//                         assert.isFalse(result)
//                     })
//             })
//         })
//
//         context('when a database error occurs', () => {
//             it('should reject a error', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOne')
//                     .withArgs({ _id: user.id })
//                     .rejects({ message: 'An internal error has occurred in the database!' })
//
//                 return repo.changePassword(user.id!, user.password!, user.password!)
//                     .catch(err => {
//                         assert.equal(err.message, 'An internal error has occurred in the database!')
//                         assert.equal(err.description, 'Please try again later...')
//                     })
//             })
//
//             it('should reject a error', () => {
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOne')
//                     .withArgs({ _id: user.id })
//                     .resolves(anotherUser)
//
//                 sinon
//                     .mock(modelFake)
//                     .expects('findOneAndUpdate')
//                     .withArgs({ _id: user.id }, anotherUser, { new: true })
//                     .rejects({ message: 'An internal error has occurred in the database!' })
//
//                 return repo.changePassword(user.id!, user.password!, user.password!)
//                     .catch(err => {
//                         assert.equal(err.message, 'An internal error has occurred in the database!')
//                         assert.equal(err.description, 'Please try again later...')
//                     })
//             })
//         })
//     })
// })
