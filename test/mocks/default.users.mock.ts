import { ObjectId } from 'bson'
import { HealthAreaTypes } from '../../src/application/domain/utils/health.area.types'

export abstract class DefaultUsersMock {
    public static readonly ADMIN: any = {
        id: new ObjectId(),
        username: 'admin',
        password: 'admin123',
        email: 'admin@mail.com'
    }

    public static readonly HEALTH_PROFESSIONAL: any = {
        id: new ObjectId(),
        username: 'health',
        password: 'health123',
        email: 'health@mail.com',
        name: 'health pro',
        health_area: HealthAreaTypes.NUTRITION
    }

    public static readonly USER: any = {
        id: new ObjectId(),
        username: 'user',
        password: 'user123'
    }
}
