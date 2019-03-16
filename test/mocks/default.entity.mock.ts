import { ObjectId } from 'bson'
import { HealthAreaTypes } from '../../src/application/domain/utils/health.area.types'

export abstract class DefaultEntityMock {
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

    public static readonly PILOT_STUDY: any = {
        id: new ObjectId(),
        name: 'pilotstudy',
        is_active: 'true',
        start: '2019-03-15T00:00:00',
        end: '2019-04-15T23:59:59',
        health_professional_ids: [new ObjectId()]
    }
}
