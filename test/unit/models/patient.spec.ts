// import { assert } from 'chai'
// import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
// import { Patient } from '../../../src/application/domain/model/patient'
//
// describe('Models: Patient', () => {
//     describe('fromJSON()', () => {
//         context('when the json contain all parameters', () => {
//             it('should return the class with parameters set', () => {
//                 const result = new Patient().fromJSON(DefaultEntityMock.PATIENT)
//                 assert.equal(result.pilot_studies, DefaultEntityMock.PATIENT.pilotstudy_id)
//                 assert.equal(result.name, DefaultEntityMock.PATIENT.name)
//             })
//         })
//
//         context('when the json is undefined', () => {
//             it('should return the class without parameters', () => {
//                 const result = new Patient().fromJSON(undefined)
//                 assert.equal(result.id, undefined)
//                 assert.equal(result.pilot_studies, undefined)
//                 assert.equal(result.name, undefined)
//             })
//         })
//
//         context('when the json is empty', () => {
//             it('should return the class without parameters', () => {
//                 const result = new Patient().fromJSON({})
//                 assert.equal(result.id, undefined)
//                 assert.equal(result.pilot_studies, undefined)
//                 assert.equal(result.name, undefined)
//             })
//         })
//
//         context('when pass json as string', () => {
//             it('should return the object with json parameters set', () => {
//                 const result = new Patient().fromJSON(JSON.stringify(DefaultEntityMock.PATIENT))
//                 assert.equal(result.pilot_studies, DefaultEntityMock.PATIENT.pilotstudy_id)
//                 assert.equal(result.name, DefaultEntityMock.PATIENT.name)
//             })
//
//             it('should return the class without parameters for empty string', () => {
//                 it('should return the class without parameters', () => {
//                     const result = new Patient().fromJSON('')
//                     assert.equal(result.id, undefined)
//                     assert.equal(result.pilot_studies, undefined)
//                     assert.equal(result.name, undefined)
//                 })
//             })
//         })
//
//         context('when pass the parameters', () => {
//             it('should return the object with set pilot_studies', () => {
//                 const result = new Patient().fromJSON({
//                     pilotstudy_id: DefaultEntityMock.PATIENT.pilotstudy_id
//                 })
//                 assert.equal(result.pilot_studies, DefaultEntityMock.PATIENT.pilotstudy_id)
//                 assert.equal(result.name, undefined)
//             })
//
//             it('should return the object with set name', () => {
//                 const result = new Patient().fromJSON({
//                     pilotstudy_id: DefaultEntityMock.PATIENT.pilotstudy_id,
//                     name: DefaultEntityMock.PATIENT.name
//                 })
//                 assert.equal(result.pilot_studies, DefaultEntityMock.PATIENT.pilotstudy_id)
//                 assert.equal(result.name, DefaultEntityMock.PATIENT.name)
//             })
//
//             it('should return the object with set email', () => {
//                 const result = new Patient().fromJSON({
//                     pilotstudy_id: DefaultEntityMock.PATIENT.pilotstudy_id,
//                     name: DefaultEntityMock.PATIENT.name,
//                     email: DefaultEntityMock.PATIENT.email
//                 })
//                 assert.equal(result.pilot_studies, DefaultEntityMock.PATIENT.pilotstudy_id)
//                 assert.equal(result.name, DefaultEntityMock.PATIENT.name)
//                 assert.equal(result.email, DefaultEntityMock.PATIENT.email)
//             })
//
//             it('should return the object with set gender', () => {
//                 const result = new Patient().fromJSON({
//                     pilotstudy_id: DefaultEntityMock.PATIENT.pilotstudy_id,
//                     name: DefaultEntityMock.PATIENT.name,
//                     email: DefaultEntityMock.PATIENT.email,
//                     gender: DefaultEntityMock.PATIENT.gender
//                 })
//                 assert.equal(result.pilot_studies, DefaultEntityMock.PATIENT.pilotstudy_id)
//                 assert.equal(result.name, DefaultEntityMock.PATIENT.name)
//                 assert.equal(result.email, DefaultEntityMock.PATIENT.email)
//                 assert.equal(result.gender, DefaultEntityMock.PATIENT.gender)
//             })
//
//             it('should return the object with set birth_date', () => {
//                 const result = new Patient().fromJSON({
//                     pilotstudy_id: DefaultEntityMock.PATIENT.pilotstudy_id,
//                     name: DefaultEntityMock.PATIENT.name,
//                     email: DefaultEntityMock.PATIENT.email,
//                     gender: DefaultEntityMock.PATIENT.gender,
//                     birth_date: DefaultEntityMock.PATIENT.birth_date
//                 })
//                 assert.equal(result.pilot_studies, DefaultEntityMock.PATIENT.pilotstudy_id)
//                 assert.equal(result.name, DefaultEntityMock.PATIENT.name)
//                 assert.equal(result.email, DefaultEntityMock.PATIENT.email)
//                 assert.equal(result.gender, DefaultEntityMock.PATIENT.gender)
//                 assert.equal(result.birth_date, DefaultEntityMock.PATIENT.birth_date)
//             })
//         })
//     })
//
//     describe('toJSON()', () => {
//         it('should return the object as JSON', () => {
//             const activity = new Patient().fromJSON(DefaultEntityMock.PATIENT)
//             const result = activity.toJSON()
//             assert.equal(result.name, DefaultEntityMock.PATIENT.name)
//             assert.equal(result.email, DefaultEntityMock.PATIENT.email)
//             assert.equal(result.gender, DefaultEntityMock.PATIENT.gender)
//             assert.equal(result.birth_date, DefaultEntityMock.PATIENT.birth_date)
//         })
//     })
// })
