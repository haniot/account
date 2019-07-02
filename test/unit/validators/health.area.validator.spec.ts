// import { assert } from 'chai'
// import { HealthAreaTypes } from '../../../src/application/domain/utils/health.area.types'
// import { HealthAreaValidator } from '../../../src/application/domain/validator/health.area.validator'
//
// describe('Validators: HealthAreaValidator', () => {
//     it('should return undefined when the validation was successful', () => {
//         const result = HealthAreaValidator.validate(HealthAreaTypes.NUTRITION)
//         assert.equal(result, undefined)
//     })
//
//     context('when the health area is invalid', () => {
//         it('should throw an error for invalid health area', () => {
//             try {
//                 HealthAreaValidator.validate('oncology')
//             } catch (err) {
//                 assert.property(err, 'message')
//                 assert.property(err, 'description')
//                 assert.equal(err.message, 'Health Area not mapped!')
//                 assert.equal(err.description, 'The mapped areas are: nutrition, dentistry.')
//             }
//         })
//     })
// })
