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
import { ConnectionFactoryRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.factory.rabbitmq'
import { IConnectionEventBus } from '../infrastructure/port/connection.event.bus.interface'
import { EventBusRabbitMQ } from '../infrastructure/eventbus/rabbitmq/eventbus.rabbitmq'
import { ConnectionRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.rabbitmq'
import { IEventBus } from '../infrastructure/port/event.bus.interface'
import { PublishEventBusTask } from '../background/task/publish.event.bus.task'
import { IntegrationEventRepoModel } from '../infrastructure/database/schema/integration.event.schema'
import { IntegrationEventRepository } from '../infrastructure/repository/integration.event.repository'
import { IIntegrationEventRepository } from '../application/port/integration.event.repository.interface'
import { RpcServerEventBusTask } from '../background/task/rpc.server.event.bus.task'
import { PatientsGoalsController } from '../ui/controllers/patients.goals.controller'
import { IGoalService } from '../application/port/goal.service.interface'
import { GoalService } from '../application/service/goal.service'
import { SubscribeEventBusTask } from '../background/task/subscribe.event.bus.task'

class IoC {
    private readonly _container: Container

    /**
     * Creates an instance of Di.
     *
     * @private
     */
    constructor() {
        this._container = new Container()
        this.initDependencies()
    }

    /**
     * Get Container inversify.
     *
     * @returns {Container}
     */
    get container(): Container {
        return this._container
    }

    /**
     * Initializes injectable containers.
     *
     * @private
     * @return void
     */
    private initDependencies(): void {
        this._container.bind(Identifier.APP).to(App).inSingletonScope()

        // Controllers
        this._container.bind<HomeController>(Identifier.HOME_CONTROLLER).to(HomeController).inSingletonScope()
        this._container.bind<UsersController>(Identifier.USERS_CONTROLLER).to(UsersController).inSingletonScope()
        this._container.bind<AuthController>(Identifier.AUTH_CONTROLLER)
            .to(AuthController).inSingletonScope()
        this._container.bind<AdminsController>(Identifier.ADMINS_CONTROLLER).to(AdminsController).inSingletonScope()
        this._container.bind<PatientsController>(Identifier.PATIENTS_CONTROLLER).to(PatientsController).inSingletonScope()
        this._container.bind<PatientsGoalsController>(Identifier.PATIENTS_GOALS_CONTROLLER)
            .to(PatientsGoalsController).inSingletonScope()
        this._container.bind<PatientsPilotStudiesController>(Identifier.PATIENTS_PILOT_STUDIES_CONTROLLER)
            .to(PatientsPilotStudiesController).inSingletonScope()
        this._container.bind<HealthProfessionalsController>(Identifier.HEALTH_PROFESSIONALS_CONTROLLER)
            .to(HealthProfessionalsController).inSingletonScope()
        this._container.bind<HealthProfessionalsPilotStudiesController>(Identifier.HEALTH_PROFESSIONALS_PILOT_STUDIES_CONTROLLER)
            .to(HealthProfessionalsPilotStudiesController).inSingletonScope()
        this._container.bind<PilotStudiesController>(Identifier.PILOT_STUDIES_CONTROLLER)
            .to(PilotStudiesController).inSingletonScope()
        this._container.bind<PilotStudiesHealthProfessionalsController>(Identifier.PILOT_STUDIES_HEALTH_PROFESSIONALS_CONTROLLER)
            .to(PilotStudiesHealthProfessionalsController).inSingletonScope()
        this._container.bind<PilotStudiesPatientsController>(Identifier.PILOT_STUDIES_PATIENTS_CONTROLLER)
            .to(PilotStudiesPatientsController).inSingletonScope()

        // Services
        this._container.bind<IUserService>(Identifier.USER_SERVICE).to(UserService).inSingletonScope()
        this._container.bind<IAuthService>(Identifier.AUTH_SERVICE)
            .to(AuthService).inSingletonScope()
        this._container.bind<IHealthProfessionalService>(Identifier.HEALTH_PROFESSIONAL_SERVICE)
            .to(HealthProfessionalService).inSingletonScope()
        this._container.bind<IAdminService>(Identifier.ADMIN_SERVICE)
            .to(AdminService).inSingletonScope()
        this._container.bind<IPatientService>(Identifier.PATIENT_SERVICE)
            .to(PatientService).inSingletonScope()
        this._container.bind<IGoalService>(Identifier.GOAL_SERVICE)
            .to(GoalService).inSingletonScope()
        this._container.bind<IPilotStudyService>(Identifier.PILOT_STUDY_SERVICE)
            .to(PilotStudyService).inSingletonScope()

        // Repositories
        this._container
            .bind<IUserRepository>(Identifier.USER_REPOSITORY)
            .to(UserRepository).inSingletonScope()
        this._container.bind<IAuthRepository>(Identifier.AUTH_REPOSITORY)
            .to(AuthRepository).inSingletonScope()
        this._container.bind<IHealthProfessionalRepository>(Identifier.HEALTH_PROFESSIONAL_REPOSITORY)
            .to(HealthProfessionalRepository).inSingletonScope()
        this._container.bind<IAdminRepository>(Identifier.ADMIN_REPOSITORY)
            .to(AdminRepository).inSingletonScope()
        this._container.bind<IPatientRepository>(Identifier.PATIENT_REPOSITORY)
            .to(PatientRepository).inSingletonScope()
        this._container.bind<IPilotStudyRepository>(Identifier.PILOT_STUDY_REPOSITORY)
            .to(PilotStudyRepository).inSingletonScope()
        this._container
            .bind<IIntegrationEventRepository>(Identifier.INTEGRATION_EVENT_REPOSITORY)
            .to(IntegrationEventRepository).inSingletonScope()

        // Models
        this._container.bind(Identifier.USER_REPO_MODEL).toConstantValue(UserRepoModel)
        this._container.bind(Identifier.PILOT_STUDY_REPO_MODEL).toConstantValue(PilotStudyRepoModel)
        this._container.bind(Identifier.INTEGRATION_EVENT_REPO_MODEL).toConstantValue(IntegrationEventRepoModel)

        // Mappers
        this._container
            .bind<IEntityMapper<User, UserEntity>>(Identifier.USER_ENTITY_MAPPER)
            .to(UserEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<HealthProfessional, HealthProfessionalEntity>>(Identifier.HEALTH_PROFESSIONAL_ENTITY_MAPPER)
            .to(HealthProfessionalEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<Admin, AdminEntity>>(Identifier.ADMIN_ENTITY_MAPPER)
            .to(AdminEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<Patient, PatientEntity>>(Identifier.PATIENT_ENTITY_MAPPER)
            .to(PatientEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<PilotStudy, PilotStudyEntity>>(Identifier.PILOT_STUDY_ENTITY_MAPPER)
            .to(PilotStudyEntityMapper).inSingletonScope()

        // Background Services
        this._container
            .bind<IConnectionFactory>(Identifier.MONGODB_CONNECTION_FACTORY)
            .to(ConnectionFactoryMongodb).inSingletonScope()
        this._container
            .bind<IConnectionDB>(Identifier.MONGODB_CONNECTION)
            .to(ConnectionMongodb).inSingletonScope()
        this._container
            .bind<IConnectionFactory>(Identifier.RABBITMQ_CONNECTION_FACTORY)
            .to(ConnectionFactoryRabbitMQ).inSingletonScope()
        this._container
            .bind<IConnectionEventBus>(Identifier.RABBITMQ_CONNECTION)
            .to(ConnectionRabbitMQ)
        this._container
            .bind<IEventBus>(Identifier.RABBITMQ_EVENT_BUS)
            .to(EventBusRabbitMQ).inSingletonScope()
        this._container
            .bind(Identifier.BACKGROUND_SERVICE)
            .to(BackgroundService).inSingletonScope()

        // Tasks
        this._container
            .bind<IBackgroundTask>(Identifier.PUBLISH_EVENT_BUS_TASK)
            .to(PublishEventBusTask).inRequestScope()
        this._container
            .bind<IBackgroundTask>(Identifier.SUBSCRIBE_EVENT_BUS_TASK)
            .to(SubscribeEventBusTask).inRequestScope()
        this._container
            .bind<IBackgroundTask>(Identifier.RPC_SERVER_EVENT_BUST_TASK)
            .to(RpcServerEventBusTask).inRequestScope()
        this._container
            .bind<IBackgroundTask>(Identifier.REGISTER_DEFAULT_ADMIN_TASK)
            .to(RegisterDefaultAdminTask).inRequestScope()

        // Log
        this._container.bind<ILogger>(Identifier.LOGGER).to(CustomLogger).inSingletonScope()
    }
}

export const DIContainer = new IoC().container
