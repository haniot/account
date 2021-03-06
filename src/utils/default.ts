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
    public static readonly APP_ID: string = 'account.app'
    public static readonly APP_TITLE: string = 'HANIoT Account Service'
    public static readonly APP_DESCRIPTION: string = 'Microservice responsible for adding' +
        'updating, providing, deleting and authenticating users. '
    public static readonly NODE_ENV: string = 'development' // development, test, production
    public static readonly PORT_HTTP: number = 3000
    public static readonly PORT_HTTPS: number = 3001
    public static readonly SWAGGER_PATH: string = './src/ui/swagger/api.yaml'
    public static readonly SWAGGER_URI: string = 'https://api.swaggerhub.com/apis/haniot/account-service/v1/swagger.json'
    public static readonly LOGO_URI: string = 'https://i.imgur.com/O7PxGWQ.png'

    // MongoDB
    public static readonly MONGODB_URI: string = 'mongodb://127.0.0.1:27017/account-service'
    public static readonly MONGODB_URI_TEST: string = 'mongodb://127.0.0.1:27017/account-service-test'

    // RabbitMQ
    public static readonly RABBITMQ_URI: string = 'amqp://guest:guest@127.0.0.1:5672'

    // Log
    public static readonly LOG_DIR: string = 'logs'

    // JWT
    public static readonly JWT_SECRET: string = 's3cr3tk3y'
    public static readonly ISSUER: string = 'haniot'

    // ADMIN USER DEFAULT
    public static readonly ADMIN_EMAIL: string = 'admin@haniot.com'
    public static readonly ADMIN_PASSWORD: string = 'admin*123'

    // Certificate
    // To generate self-signed certificates, see: https://devcenter.heroku.com/articles/ssl-certificate-self
    public static readonly SSL_KEY_PATH: string = '.certs/server.key'
    public static readonly SSL_CERT_PATH: string = '.certs/server.crt'
    public static readonly RABBITMQ_CA_PATH: string = '.certs/ca.crt'

    // Dashboard Host
    public static readonly DASHBOARD_HOST: string = 'https://localhost:443'
}
