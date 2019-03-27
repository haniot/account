// // import { expect } from 'chai'
// import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
// import { DefaultEntityMock } from '../../mocks/default.entity.mock'
// import { Container } from 'inversify'
// import { DI } from '../../../src/di/di'
// import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
// import { Identifier } from '../../../src/di/identifiers'
// import { App } from '../../../src/app'
// import { PilotStudyRepoModel } from '../../../src/infrastructure/database/schema/pilot.study.schema'
// import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
// import { UserRepoModel } from '../../../src/infrastructure/database/schema/user.schema'
// import { IHealthProfessionalRepository } from '../../../src/application/port/health.professional.repository.interface'
//
// const container: Container = DI.getInstance().getContainer()
// const dbConnection: IConnectionDB = container.get(Identifier.MONGODB_CONNECTION)
// const healthRepo: IHealthProfessionalRepository = container.get(Identifier.HEALTH_PROFESSIONAL_REPOSITORY)
// const app: App = container.get(Identifier.APP)
// const request = require('supertest')(app.getExpress())
//
// describe('Routes: PilotStudies', () => {
//     const pilot: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
//     const user: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)
//
//     before(async () => {
//             try {
//                 await dbConnection.tryConnect(0, 500)
//                 await deleteAllPilots({})
//                 await deleteAllUsers({})
//                 const result = await healthRepo.create(user)
//                 user.id = result.id
//                 pilot.health_professionals_id = [user]
//             } catch (err) {
//                 throw new Error('Failure on Auth test: ' + err.message)
//             }
//         }
//     )
//
//     after(async () => {
//         try {
//             await deleteAllPilots({})
//             await deleteAllUsers({})
//             await dbConnection.dispose()
//         } catch (err) {
//             throw new Error('Failure on Auth test: ' + err.message)
//         }
//     })
// })
//
// async function deleteAllUsers(doc) {
//     return await UserRepoModel.deleteMany(doc)
// }
//
// async function deleteAllPilots(doc) {
//     return await PilotStudyRepoModel.deleteMany(doc)
// }
