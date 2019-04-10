import { HealthAreaTypes } from '../../../src/application/domain/utils/health.area.types'

export abstract class DefaultEntityMock {
    public static readonly ADMIN: any = {
        id: '5ca4b4648e20e14f9a8feef0',
        username: 'admin',
        password: 'admin123',
        email: 'admin@mail.com'
    }

    public static readonly HEALTH_PROFESSIONAL: any = {
        id: '5ca4b4648c9d775c7eb9f8a2',
        username: 'health',
        password: 'health123',
        email: 'health@mail.com',
        name: 'health pro',
        health_area: HealthAreaTypes.NUTRITION
    }

    public static readonly USER: any = {
        id: '5ca4b464620630ade4ec517c',
        username: 'user',
        password: 'user123'
    }

    public static readonly PILOT_STUDY: any = {
        id: '5ca4b464f497945cb2041774',
        name: 'pilotstudy',
        is_active: true,
        start: '2019-03-15T00:00:00.000Z',
        end: '2019-04-15T23:59:59.000Z',
        health_professionals_id: [DefaultEntityMock.HEALTH_PROFESSIONAL]
    }
}
