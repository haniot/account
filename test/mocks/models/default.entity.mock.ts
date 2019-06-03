import { HealthAreaTypes } from '../../../src/application/domain/utils/health.area.types'
import { GenderTypes } from '../../../src/application/domain/utils/gender.types'

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

    public static readonly PATIENT: any = {
        id: '5ca23b9af04e7c28223cb590',
        name: 'Elvis Aaron',
        email: 'elvis@mail.com',
        password: 'patient123',
        gender: GenderTypes.MALE,
        birth_date: '1935-01-08',
        pilotstudy_id: '5ca4b464f497945cb2041774'
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
