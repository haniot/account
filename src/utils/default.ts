/**
 * Class that defines variables with default values.
 *
 * @see Variables defined in .env will have preference.
 * @see Be careful not to put critical data in this file as it is not in .gitignore.
 * Sensitive data such as database, passwords and keys should be stored in secure locations.
 *
 * @abstract
 */
export abstract class Default {
    public static readonly APP_TITLE: string = 'HANIoT Account Service'
    public static readonly APP_DESCRIPTION: string = 'Microservice responsible for adding' +
    'updating, providing, deleting and authenticating users. '
    public static readonly NODE_ENV: string = 'development' // development, test, production
    public static readonly PORT_HTTP: number = 80
    public static readonly PORT_HTTPS: number = 443
    public static readonly SWAGGER_PATH: string = './src/ui/swagger/api.yaml'

    // MongoDB
    public static readonly MONGODB_URI: string = 'mongodb://127.0.0.1:27017/haniot-account-service'
    public static readonly MONGODB_URI_TEST: string = 'mongodb://127.0.0.1:27017/haniot-account-service-test'
    public static readonly MONGODB_CON_RETRY_COUNT: number = 0 // infinite
    public static readonly MONGODB_CON_RETRY_INTERVAL: number = 1000 // 1s

    // Log
    public static readonly LOG_DIR: string = 'logs'

    // JWT Secret
    public static readonly JWT_SECRET: string = 's3cr3tk3y'
}
