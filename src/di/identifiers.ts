/**
 * Constants used in dependence injection.
 *
 * @abstract
 */
export abstract class Identifier {
    public static readonly APP: any = Symbol.for('App')

    // Controllers
    public static readonly HOME_CONTROLLER: any = Symbol.for('HomeController')
    public static readonly USER_CONTROLLER: any = Symbol.for('UserController')
    public static readonly AUTH_CONTROLLER: any = Symbol.for('AuthController')
    public static readonly ADMIN_CONTROLLER: any = Symbol.for('AdminController')
    public static readonly HEALTH_PROFESSIONAL_CONTROLLER: any = Symbol.for('HealthProfessionalController')
    public static readonly PILOT_STUDY_CONTROLLER: any = Symbol.for('PilotStudyController')

    // Services
    public static readonly USER_SERVICE: any = Symbol.for('UserService')
    public static readonly AUTH_SERVICE: any = Symbol.for('AuthService')
    public static readonly HEALTH_PROFESSIONAL_SERVICE: any = Symbol.for('HealthProfessionalService')
    public static readonly ADMIN_SERVICE: any = Symbol.for('AdminService')
    public static readonly PILOT_STUDY_SERVICE: any = Symbol.for('PilotStudyService')

    // Repositories
    public static readonly USER_REPOSITORY: any = Symbol.for('UserRepository')
    public static readonly AUTH_REPOSITORY: any = Symbol.for('AuthRepository')
    public static readonly HEALTH_PROFESSIONAL_REPOSITORY: any = Symbol.for('HealthProfessionalRepository')
    public static readonly ADMIN_REPOSITORY: any = Symbol.for('AdminRepository')
    public static readonly PILOT_STUDY_REPOSITORY: any = Symbol.for('PilotStudyRepository')

    // Models
    public static readonly USER_REPO_MODEL: any = Symbol.for('UserRepoModel')
    public static readonly PILOT_STUDY_REPO_MODEL: any = Symbol.for('PilotStudyRepoModel')

    // Mappers
    public static readonly USER_ENTITY_MAPPER: any = Symbol.for('UserEntityMapper')
    public static readonly HEALTH_PROFESSIONAL_ENTITY_MAPPER: any = Symbol.for('HealthProfessionalEntityMapper')
    public static readonly ADMIN_ENTITY_MAPPER: any = Symbol.for('AdminEntityMapper')
    public static readonly PILOT_STUDY_ENTITY_MAPPER: any = Symbol.for('PilotStudyEntityMapper')

    // Background Services
    public static readonly MONGODB_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryMongodb')
    public static readonly MONGODB_CONNECTION: any = Symbol.for('ConnectionMongodb')
    public static readonly BACKGROUND_SERVICE: any = Symbol.for('BackgroundService')

    // Tasks
    public static readonly REGISTER_DEFAULT_ADMIN_TASK: any = Symbol.for('RegisterDefaultAdminTask')

    // Log
    public static readonly LOGGER: any = Symbol.for('CustomLogger')
}
