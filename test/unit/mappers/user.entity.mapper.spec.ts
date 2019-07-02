// import { UserEntityMapper } from '../../../src/infrastructure/entity/mapper/user.entity.mapper'
// import { User } from '../../../src/application/domain/model/user'
// import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
// import { UserEntity } from '../../../src/infrastructure/entity/user.entity'
// import { assert } from 'chai'
//
// describe('Mappers: UserEntityMapper', () => {
//     const mapper = new UserEntityMapper()
//     const userJSON = {
//         id: DefaultEntityMock.USER.id,
//         password: DefaultEntityMock.USER.password,
//         type: 'any',
//         scopes: ['none'],
//         change_password: true
//     }
//     const userModel: User = new User()
//     userModel.id = userJSON.id
//     userModel.password = userJSON.password
//     userModel.type = userJSON.type
//     userModel.scopes = userJSON.scopes
//     userModel.change_password = userJSON.change_password
//
//     describe('transform()', () => {
//         context('when the parameter is a json', () => {
//             it('should call the jsonToModel() method', () => {
//                 const result = mapper.transform(userJSON)
//                 assert.property(result, 'id')
//                 assert.propertyVal(result, 'id', userModel.id)
//                 assert.property(result, 'password')
//                 assert.propertyVal(result, 'password', userModel.password)
//                 assert.property(result, 'type')
//                 assert.propertyVal(result, 'type', userModel.type)
//                 assert.property(result, 'scopes')
//                 assert.deepPropertyVal(result, 'scopes', userModel.scopes)
//             })
//
//             it('should return model without parameters for empty json', () => {
//                 const result = mapper.transform({})
//                 assert.property(result, 'password')
//                 assert.propertyVal(result, 'password', undefined)
//                 assert.property(result, 'type')
//                 assert.propertyVal(result, 'type', undefined)
//                 assert.property(result, 'scopes')
//                 assert.deepPropertyVal(result, 'scopes', undefined)
//                 assert.property(result, 'change_password')
//                 assert.propertyVal(result, 'change_password', undefined)
//             })
//             it('should return model without parameter for undefined json', () => {
//                 const result = mapper.transform(undefined)
//                 assert.property(result, 'password')
//                 assert.propertyVal(result, 'password', undefined)
//                 assert.property(result, 'type')
//                 assert.propertyVal(result, 'type', undefined)
//                 assert.property(result, 'scopes')
//                 assert.deepPropertyVal(result, 'scopes', undefined)
//                 assert.property(result, 'change_password')
//                 assert.propertyVal(result, 'change_password', undefined)
//             })
//
//         })
//
//         context('when the parameter is a model', () => {
//             it('should call the modelToModelEntity() method', () => {
//                 const result = mapper.transform(userModel)
//                 assert.property(result, 'id')
//                 assert.propertyVal(result, 'id', userModel.id)
//                 assert.property(result, 'password')
//                 assert.propertyVal(result, 'password', userModel.password)
//                 assert.property(result, 'type')
//                 assert.propertyVal(result, 'type', userModel.type)
//                 assert.property(result, 'scopes')
//                 assert.deepPropertyVal(result, 'scopes', userModel.scopes)
//                 assert.property(result, 'change_password')
//                 assert.propertyVal(result, 'change_password', userModel.change_password)
//             })
//
//             it('should return a model entity without parameters for empty model', () => {
//                 const result = mapper.transform(new User())
//                 assert.isEmpty(result)
//             })
//         })
//     })
//
//     describe('modelEntityToModel()', () => {
//         context('when try to use modelEntityToModel() function', () => {
//             it('should throw an error', () => {
//                 try {
//                     mapper.modelEntityToModel(new UserEntity())
//                 } catch (err) {
//                     assert.property(err, 'message')
//                     assert.property(err, 'message', 'Not implemented!')
//                 }
//             })
//         })
//     })
// })
