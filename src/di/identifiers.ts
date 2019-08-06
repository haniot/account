/**
 * Constants used in dependence injection.
 *
 * @abstract
 */
export abstract class Identifier {
    public static readonly APP: any = Symbol.for('App')

    // Controllers
    public static readonly HOME_CONTROLLER: any = Symbol.for('HomeController')
    public static readonly USERS_CONTROLLER: any = Symbol.for('UsersController')
    public static readonly AUTH_CONTROLLER: any = Symbol.for('AuthController')
    public static readonly ADMINS_CONTROLLER: any = Symbol.for('AdminsController')
    public static readonly PATIENTS_CONTROLLER: any = Symbol.for('PatientsController')
    public static readonly PATIENTS_PILOT_STUDIES_CONTROLLER: any = Symbol.for('PatientsPilotStudiesController')
    public static readonly HEALTH_PROFESSIONALS_CONTROLLER: any = Symbol.for('HealthProfessionalsController')
    public static readonly HEALTH_PROFESSIONALS_PILOT_STUDIES_CONTROLLER: any =
        Symbol.for('HealthProfessionalsPilotStudiesController')
    public static readonly PILOT_STUDIES_CONTROLLER: any = Symbol.for('PilotStudiesController')
    public static readonly PILOT_STUDIES_HEALTH_PROFESSIONALS_CONTROLLER: any =
        Symbol.for('PilotStudiesHealthProfessionalsController')
    public static readonly PILOT_STUDIES_PATIENTS_CONTROLLER: any =
        Symbol.for('PilotStudiesPatientsController')

    // Services
    public static readonly USER_SERVICE: any = Symbol.for('UserService')
    public static readonly AUTH_SERVICE: any = Symbol.for('AuthService')
    public static readonly HEALTH_PROFESSIONAL_SERVICE: any = Symbol.for('HealthProfessionalService')
    public static readonly ADMIN_SERVICE: any = Symbol.for('AdminService')
    public static readonly PATIENT_SERVICE: any = Symbol.for('PatientService')
    public static readonly PILOT_STUDY_SERVICE: any = Symbol.for('PilotStudyService')

    // Repositories
    public static readonly USER_REPOSITORY: any = Symbol.for('UserRepository')
    public static readonly AUTH_REPOSITORY: any = Symbol.for('AuthRepository')
    public static readonly HEALTH_PROFESSIONAL_REPOSITORY: any = Symbol.for('HealthProfessionalRepository')
    public static readonly ADMIN_REPOSITORY: any = Symbol.for('AdminRepository')
    public static readonly PATIENT_REPOSITORY: any = Symbol.for('PatientRepository')
    public static readonly PILOT_STUDY_REPOSITORY: any = Symbol.for('PilotStudyRepository')
    public static readonly INTEGRATION_EVENT_REPOSITORY: any = Symbol.for('IntegrationEventRepository')

    // Models
    public static readonly USER_REPO_MODEL: any = Symbol.for('UserRepoModel')
    public static readonly PILOT_STUDY_REPO_MODEL: any = Symbol.for('PilotStudyRepoModel')
    public static readonly INTEGRATION_EVENT_REPO_MODEL: any = Symbol.for('IntegrationEventRepoModel')

    // Mappers
    public static readonly USER_ENTITY_MAPPER: any = Symbol.for('UserEntityMapper')
    public static readonly HEALTH_PROFESSIONAL_ENTITY_MAPPER: any = Symbol.for('HealthProfessionalEntityMapper')
    public static readonly ADMIN_ENTITY_MAPPER: any = Symbol.for('AdminEntityMapper')
    public static readonly PATIENT_ENTITY_MAPPER: any = Symbol.for('PatientEntityMapper')
    public static readonly PILOT_STUDY_ENTITY_MAPPER: any = Symbol.for('PilotStudyEntityMapper')

    // Background Services
    public static readonly MONGODB_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryMongodb')
    public static readonly MONGODB_CONNECTION: any = Symbol.for('ConnectionMongodb')
    public static readonly RABBITMQ_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryRabbitMQ')
    public static readonly RABBITMQ_CONNECTION: any = Symbol.for('ConnectionRabbitMQ')
    public static readonly RABBITMQ_EVENT_BUS: any = Symbol.for('EventBusRabbitMQ')
    public static readonly BACKGROUND_SERVICE: any = Symbol.for('BackgroundService')
    public static readonly PUBLISH_EVENT_BUS_TASK: any = Symbol.for('PublishEventBusTask')
    public static readonly SUBSCRIBE_EVENT_BUS_TASK: any = Symbol.for('SubscribeEventBusTask')

    // Tasks
    public static readonly REGISTER_DEFAULT_ADMIN_TASK: any = Symbol.for('RegisterDefaultAdminTask')

    // Log
    public static readonly LOGGER: any = Symbol.for('CustomLogger')
}
