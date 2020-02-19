export enum AccessStatusTypes {
    VALID_TOKEN = 'valid_token',
    INVALID_TOKEN = 'invalid_token',
    EXPIRED_TOKEN = 'expired_token',
    INVALID_REFRESH_TOKEN = 'invalid_refresh_token',
    INVALID_CLIENT = 'invalid_client',
    TOO_MANY_REQUESTS = 'rate_limit',
    NONE = 'none'
}
