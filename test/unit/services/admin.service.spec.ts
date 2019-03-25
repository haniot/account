import { assert } from 'chai'
import { AdminService } from '../../../src/application/service/admin.service'
import { AdminRepositoryMock } from '../../mocks/admin.repository.mock'
import { UserRepositoryMock } from '../../mocks/user.repository.mock'
import { Admin } from '../../../src/application/domain/model/admin'
import { DefaultEntityMock } from '../../mocks/default.entity.mock'
import { Strings } from '../../../src/utils/strings'
import { Query } from '../../../src/infrastructure/repository/query/query'

describe('Services: AdminService', () => {
    const service = new AdminService(new AdminRepositoryMock(), new UserRepositoryMock())
    const user: Admin = new Admin().fromJSON(DefaultEntityMock.ADMIN)

    describe('add()', () => {
        context('when want save a new user', () => {
            it('should return the saved user', () => {
                return service.add(user)
                    .then(result => {
                        assert.property(result, 'id')
                        assert.propertyVal(result, 'id', user.id)
                        assert.property(result, 'email')
                        assert.propertyVal(result, 'email', user.email)
                        assert.property(result, 'password')
                        assert.propertyVal(result, 'password', user.password)
                    }).catch(err => {
                        console.log(err)
                    })
            })
        })

        context('when the user was incomplete or invalid', () => {
            it('should throw an error for does not pass email', () => {
                user.email = undefined
                return service.add(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', 'Required fields were not provided...')
                        assert.property(err, 'description')
                        assert.propertyVal(err, 'description', 'User validation: email required!')
                    })
            })

            it('should throw an error for invalid email', () => {
                user.email = 'invalid'
                return service.add(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', 'Invalid email address!')
                        user.email = DefaultEntityMock.ADMIN.email
                    })
            })

            it('should throw an error for existent email', () => {
                user.email = 'exists@mail.com'
                return service.add(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', Strings.USER.EMAIL_ALREADY_REGISTERED)
                        user.email = DefaultEntityMock.ADMIN.email
                    })
            })

            it('should throw an error for does not pass password', () => {
                user.password = undefined
                return service.add(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', 'Required fields were not provided...')
                        assert.property(err, 'description')
                        assert.propertyVal(err, 'description', 'User validation: password required!')
                        user.password = DefaultEntityMock.ADMIN.password
                    })
            })

            it('should throw an error for does not pass any of required parameters', () => {
                return service.add(new Admin())
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', 'Required fields were not provided...')
                        assert.property(err, 'description')
                        assert.propertyVal(err, 'description', 'User validation: email, password required!')
                    })
            })
        })
    })

    describe('getAll', () => {
        it('should return a list of users', () => {
            return service.getAll(new Query())
                .then(result => {
                    assert.isArray(result)
                    assert.lengthOf(result, 1)
                    assert.property(result[0], 'id')
                    assert.propertyVal(result[0], 'id', user.id)
                    assert.property(result[0], 'email')
                    assert.propertyVal(result[0], 'email', user.email)
                    assert.property(result[0], 'password')
                    assert.propertyVal(result[0], 'password', user.password)
                })
        })
    })

    describe('getById()', () => {
        context('when get a unique user', () => {
            it('should return the required user', () => {
                return service.getById(user.id!, new Query())
                    .then(result => {
                        assert.property(result, 'id')
                        assert.propertyVal(result, 'id', user.id)
                        assert.property(result, 'email')
                        assert.propertyVal(result, 'email', user.email)
                        assert.property(result, 'password')
                        assert.propertyVal(result, 'password', user.password)
                    })
            })
        })

        context('when the id is invalid', () => {
            it('should throw an error for invalid id', () => {
                return service.getById('123', new Query())
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })
        })
    })

    describe('delete()', () => {
        context('when want delete a user', () => {
            it('should return true', () => {
                return service.remove(user.id!)
                    .then(result => {
                        assert.isBoolean(result)
                        assert.isTrue(result)
                    })
            })
        })

        context('when the id is invalid', () => {
            it('should throw an error for invalid id', () => {
                return service.remove('123')
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'Some ID provided does not have a valid format!')
                        assert.equal(err.description, 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })
        })
    })

    describe('update()', () => {
        context('when want update a user', () => {
            it('should return the updated user', () => {
                user.password = undefined
                return service.update(user)
                    .then(result => {
                        assert.property(result, 'id')
                        assert.propertyVal(result, 'id', user.id)
                        assert.property(result, 'email')
                        assert.propertyVal(result, 'email', user.email)
                        user.password = DefaultEntityMock.ADMIN.password
                    })
            })
        })

        context('when there are invalid parameters', () => {
            it('should throw error for pass invalid email', () => {
                user.email = 'anything'
                return service.update(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.equal(err.message, 'Invalid email address!')
                        user.email = DefaultEntityMock.ADMIN.email
                    })
            })

            it('should throw error for try update password', () => {
                return service.update(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.property(err, 'description')
                        assert.equal(err.message, 'This parameter could not be updated.')
                        assert.equal(err.description, 'A specific route to update user password already exists.' +
                            ` Access: PATCH /users/${user.id}/password to update your password.`)
                    })
            })

            it('should throw an error for existent email', () => {
                user.email = 'exists@mail.com'
                user.password = undefined
                return service.update(user)
                    .catch(err => {
                        assert.property(err, 'message')
                        assert.propertyVal(err, 'message', Strings.USER.EMAIL_ALREADY_REGISTERED)
                        user.email = DefaultEntityMock.ADMIN.email
                        user.password = DefaultEntityMock.ADMIN.password
                    })
            })
        })

    })
})
