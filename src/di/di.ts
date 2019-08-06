import 'reflect-metadata'
import { Container } from 'inversify'
import { HomeController } from '../ui/controllers/home.controller'
import { Identifier } from './identifiers'
import { UsersController } from '../ui/controllers/users.controller'
import { IUserService } from '../application/port/user.service.interface'
import { UserService } from '../application/service/user.service'
import { IUserRepository } from '../application/port/user.repository.interface'
import { UserEntity } from '../infrastructure/entity/user.entity'
import { UserRepoModel } from '../infrastructure/database/schema/user.schema'
import { UserEntityMapper } from '../infrastructure/entity/mapper/user.entity.mapper'
import { User } from '../application/domain/model/user'
import { ConnectionFactoryMongodb } from '../infrastructure/database/connection.factory.mongodb'
import { ConnectionMongodb } from '../infrastructure/database/connection.mongodb'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { IConnectionFactory } from '../infrastructure/port/connection.factory.interface'
import { BackgroundService } from '../background/background.service'
import { App } from '../app'
import { CustomLogger, ILogger } from '../utils/custom.logger'
import { AuthController } from '../ui/controllers/auth.controller'
import { IAuthService } from '../application/port/auth.service.interface'
import { AuthService } from '../application/service/auth.service'
import { IAuthRepository } from '../application/port/auth.repository.interface'
import { AuthRepository } from '../infrastructure/repository/auth.repository'
import { HealthProfessional } from '../application/domain/model/health.professional'
import { HealthProfessionalEntity } from '../infrastructure/entity/health.professional.entity'
import { HealthProfessionalEntityMapper } from '../infrastructure/entity/mapper/health.professional.entity.mapper'
import { IEntityMapper } from '../infrastructure/port/entity.mapper.interface'
import { IHealthProfessionalRepository } from '../application/port/health.professional.repository.interface'
import { HealthProfessionalRepository } from '../infrastructure/repository/health.professional.repository'
import { IAdminRepository } from '../application/port/admin.repository.interface'
import { AdminRepository } from '../infrastructure/repository/admin.repository'
import { UserRepository } from '../infrastructure/repository/user.repository'
import { AdminEntity } from '../infrastructure/entity/admin.entity'
import { Admin } from '../application/domain/model/admin'
import { AdminEntityMapper } from '../infrastructure/entity/mapper/admin.entity.mapper'
import { IHealthProfessionalService } from '../application/port/health.professional.service.interface'
import { IAdminService } from '../application/port/admin.service.interface'
import { HealthProfessionalService } from '../application/service/health.professional.service'
import { AdminService } from '../application/service/admin.service'
import { AdminsController } from '../ui/controllers/admins.controller'
import { HealthProfessionalsController } from '../ui/controllers/health.professionals.controller'
import { PilotStudyRepoModel } from '../infrastructure/database/schema/pilot.study.schema'
import { PilotStudy } from '../application/domain/model/pilot.study'
import { PilotStudyEntity } from '../infrastructure/entity/pilot.study.entity'
import { PilotStudyEntityMapper } from '../infrastructure/entity/mapper/pilot.study.entity.mapper'
import { IPilotStudyRepository } from '../application/port/pilot.study.repository.interface'
import { PilotStudyRepository } from '../infrastructure/repository/pilot.study.repository'
import { PilotStudiesController } from '../ui/controllers/pilot.studies.controller'
import { IPilotStudyService } from '../application/port/pilot.study.service.interface'
import { PilotStudyService } from '../application/service/pilot.study.service'
import { IBackgroundTask } from '../application/port/background.task.interface'
import { RegisterDefaultAdminTask } from '../background/task/register.default.admin.task'
import { Patient } from '../application/domain/model/patient'
import { PatientEntity } from '../infrastructure/entity/patient.entity'
import { PatientEntityMapper } from '../infrastructure/entity/mapper/patient.entity.mapper'
import { IPatientRepository } from '../application/port/patient.repository.interface'
import { PatientRepository } from '../infrastructure/repository/patient.repository'
import { IPatientService } from '../application/port/patient.service.interface'
import { PatientService } from '../application/service/patient.service'
import { PatientsController } from '../ui/controllers/patients.controller'
import { HealthProfessionalsPilotStudiesController } from '../ui/controllers/health.professionals.pilot.studies.controller'
import { PilotStudiesHealthProfessionalsController } from '../ui/controllers/pilot.studies.health.professionals.controller'
import { PilotStudiesPatientsController } from '../ui/controllers/pilot.studies.patients.controller'
import { PatientsPilotStudiesController } from '../ui/controllers/patients.pilot.studies.controller'

export class DI {
    private static instance: DI
    private readonly container: Container

    /**
     * Creates an instance of DI.
     *
     * @private
     */
    private constructor() {
        this.container = new Container()
        this.initDependencies()
    }

    /**
     * Recover single instance of class.
     *
     * @static
     * @return {App}
     */
    public static getInstance(): DI {
        if (!this.instance) this.instance = new DI()
        return this.instance
    }

    /**
     * Get Container inversify.
     *
     * @returns {Container}
     */
    public getContainer(): Container {
        return this.container
    }

    /**
     * Initializes injectable containers.
     *
     * @private
     * @return void
     */
    private initDependencies(): void {
        this.container.bind(Identifier.APP).to(App).inSingletonScope()

        // Controllers
        this.container.bind<HomeController>(Identifier.HOME_CONTROLLER).to(HomeController).inSingletonScope()
        this.container.bind<UsersController>(Identifier.USERS_CONTROLLER).to(UsersController).inSingletonScope()
        this.container.bind<AuthController>(Identifier.AUTH_CONTROLLER)
            .to(AuthController).inSingletonScope()
        this.container.bind<AdminsController>(Identifier.ADMINS_CONTROLLER).to(AdminsController).inSingletonScope()
        this.container.bind<PatientsController>(Identifier.PATIENTS_CONTROLLER).to(PatientsController).inSingletonScope()
        this.container.bind<PatientsPilotStudiesController>(Identifier.PATIENTS_PILOT_STUDIES_CONTROLLER)
            .to(PatientsPilotStudiesController).inSingletonScope()
        this.container.bind<HealthProfessionalsController>(Identifier.HEALTH_PROFESSIONALS_CONTROLLER)
            .to(HealthProfessionalsController).inSingletonScope()
        this.container.bind<HealthProfessionalsPilotStudiesController>(Identifier.HEALTH_PROFESSIONALS_PILOT_STUDIES_CONTROLLER)
            .to(HealthProfessionalsPilotStudiesController).inSingletonScope()
        this.container.bind<PilotStudiesController>(Identifier.PILOT_STUDIES_CONTROLLER)
            .to(PilotStudiesController).inSingletonScope()
        this.container.bind<PilotStudiesHealthProfessionalsController>(Identifier.PILOT_STUDIES_HEALTH_PROFESSIONALS_CONTROLLER)
            .to(PilotStudiesHealthProfessionalsController).inSingletonScope()
        this.container.bind<PilotStudiesPatientsController>(Identifier.PILOT_STUDIES_PATIENTS_CONTROLLER)
            .to(PilotStudiesPatientsController).inSingletonScope()

        // Services
        this.container.bind<IUserService>(Identifier.USER_SERVICE).to(UserService).inSingletonScope()
        this.container.bind<IAuthService>(Identifier.AUTH_SERVICE)
            .to(AuthService).inSingletonScope()
        this.container.bind<IHealthProfessionalService>(Identifier.HEALTH_PROFESSIONAL_SERVICE)
            .to(HealthProfessionalService).inSingletonScope()
        this.container.bind<IAdminService>(Identifier.ADMIN_SERVICE)
            .to(AdminService).inSingletonScope()
        this.container.bind<IPatientService>(Identifier.PATIENT_SERVICE)
            .to(PatientService).inSingletonScope()
        this.container.bind<IPilotStudyService>(Identifier.PILOT_STUDY_SERVICE)
            .to(PilotStudyService).inSingletonScope()

        // Repositories
        this.container
            .bind<IUserRepository>(Identifier.USER_REPOSITORY)
            .to(UserRepository).inSingletonScope()
        this.container.bind<IAuthRepository>(Identifier.AUTH_REPOSITORY)
            .to(AuthRepository).inSingletonScope()
        this.container.bind<IHealthProfessionalRepository>(Identifier.HEALTH_PROFESSIONAL_REPOSITORY)
            .to(HealthProfessionalRepository).inSingletonScope()
        this.container.bind<IAdminRepository>(Identifier.ADMIN_REPOSITORY)
            .to(AdminRepository).inSingletonScope()
        this.container.bind<IPatientRepository>(Identifier.PATIENT_REPOSITORY)
            .to(PatientRepository).inSingletonScope()
        this.container.bind<IPilotStudyRepository>(Identifier.PILOT_STUDY_REPOSITORY)
            .to(PilotStudyRepository).inSingletonScope()

        // Models
        this.container.bind(Identifier.USER_REPO_MODEL).toConstantValue(UserRepoModel)
        this.container.bind(Identifier.PILOT_STUDY_REPO_MODEL).toConstantValue(PilotStudyRepoModel)

        // Mappers
        this.container
            .bind<IEntityMapper<User, UserEntity>>(Identifier.USER_ENTITY_MAPPER)
            .to(UserEntityMapper).inSingletonScope()
        this.container
            .bind<IEntityMapper<HealthProfessional, HealthProfessionalEntity>>(Identifier.HEALTH_PROFESSIONAL_ENTITY_MAPPER)
            .to(HealthProfessionalEntityMapper).inSingletonScope()
        this.container
            .bind<IEntityMapper<Admin, AdminEntity>>(Identifier.ADMIN_ENTITY_MAPPER)
            .to(AdminEntityMapper).inSingletonScope()
        this.container
            .bind<IEntityMapper<Patient, PatientEntity>>(Identifier.PATIENT_ENTITY_MAPPER)
            .to(PatientEntityMapper).inSingletonScope()
        this.container
            .bind<IEntityMapper<PilotStudy, PilotStudyEntity>>(Identifier.PILOT_STUDY_ENTITY_MAPPER)
            .to(PilotStudyEntityMapper).inSingletonScope()

        // Background Services
        this.container
            .bind<IConnectionFactory>(Identifier.MONGODB_CONNECTION_FACTORY)
            .to(ConnectionFactoryMongodb).inSingletonScope()
        this.container
            .bind<IConnectionDB>(Identifier.MONGODB_CONNECTION)
            .to(ConnectionMongodb).inSingletonScope()
        this.container
            .bind(Identifier.BACKGROUND_SERVICE)
            .to(BackgroundService).inSingletonScope()

        // Tasks
        this.container
            .bind<IBackgroundTask>(Identifier.REGISTER_DEFAULT_ADMIN_TASK)
            .to(RegisterDefaultAdminTask).inRequestScope()

        // Log
        this.container.bind<ILogger>(Identifier.LOGGER).to(CustomLogger).inSingletonScope()
    }
}
