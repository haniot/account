// import { assert } from 'chai'
// import sinon from 'sinon'
// import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
// import { EntityMapperMock } from '../../mocks/models/entity.mapper.mock'
// import { CustomLoggerMock } from '../../mocks/custom.logger.mock'
// import { Admin } from '../../../src/application/domain/model/admin'
// import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
// import { AdminRepository } from '../../../src/infrastructure/repository/admin.repository'
// import { UserRepositoryMock } from '../../mocks/repositories/user.repository.mock'
//
// require('sinon-mongoose')
//
// describe('Repositories: AdminRepository', () => {
//     const modelFake: any = UserRepoModel
//     const repo =
//         new AdminRepository(modelFake, new EntityMapperMock(), new UserRepositoryMock(), new CustomLoggerMock())
//     const user: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)
//
//     afterEach(() => {
//         sinon.restore()
//     })
//
//     describe('create()', () => {
//         context('when save a new admin', () => {
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
//                     })
//             })
//         })
//
//         context('when the password is not passed', () => {
//             it('should return something', () => {
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
// })
