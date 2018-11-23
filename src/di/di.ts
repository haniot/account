import 'reflect-metadata'
import { Container } from 'inversify'
import { HomeController } from '../ui/controllers/home.controller'
import { Identifier } from './identifiers'
import { UserController } from '../ui/controllers/user.controller'
import { IUserService } from '../application/port/user.service.interface'
import { UserService } from '../application/service/user.service'
import { IUserRepository } from '../application/port/user.repository.interface'
import { UserRepository } from '../infrastructure/repository/user.repository'
import { UserEntity } from '../infrastructure/entity/user.entity'
import { UserRepoModel } from '../infrastructure/database/schema/user.schema'
import { UserEntityMapper } from '../infrastructure/entity/mapper/user.entity.mapper'
import { IEntityMapper } from '../infrastructure/entity/mapper/entity.mapper.interface'
import { User } from '../application/domain/model/user'
import { MongoDBConnectionFactory } from '../infrastructure/database/mongodb.connection.factory'
import { MongoDBConnection } from '../infrastructure/database/mongodb.connection'
import { IDBConnection } from '../infrastructure/port/db.connection.interface'
import { IConnectionFactory } from '../infrastructure/port/connection.factory.interface'
import { BackgroundService } from '../background/background.service'
import { App } from '../app'
import { CustomLogger, ILogger } from '../utils/custom.logger'

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
        this.container.bind<UserController>(Identifier.USER_CONTROLLER).to(UserController).inSingletonScope()

        // Services
        this.container.bind<IUserService>(Identifier.USER_SERVICE).to(UserService).inSingletonScope()

        // Repositories
        this.container
            .bind<IUserRepository>(Identifier.USER_REPOSITORY)
            .to(UserRepository).inSingletonScope()
        // Models
        this.container.bind(Identifier.USER_ENTITY).toConstantValue(UserEntity)
        this.container.bind(Identifier.USER_REPO_MODEL).toConstantValue(UserRepoModel)

        // Mappers
        this.container
            .bind<IEntityMapper<User, UserEntity>>(Identifier.USER_ENTITY_MAPPER)
            .to(UserEntityMapper).inSingletonScope()

        // Background Services
        this.container
            .bind<IConnectionFactory>(Identifier.MONGODB_CONNECTION_FACTORY)
            .to(MongoDBConnectionFactory).inSingletonScope()
        this.container
            .bind<IDBConnection>(Identifier.MONGODB_CONNECTION)
            .to(MongoDBConnection).inSingletonScope()
        this.container
            .bind(Identifier.BACKGROUND_SERVICE)
            .to(BackgroundService).inSingletonScope()

        // Log
        this.container.bind<ILogger>(Identifier.LOGGER).to(CustomLogger).inSingletonScope()
    }
}
