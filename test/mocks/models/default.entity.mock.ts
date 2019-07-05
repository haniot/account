import { HealthAreaTypes } from '../../../src/application/domain/utils/health.area.types'
import { GenderTypes } from '../../../src/application/domain/utils/gender.types'

export abstract class DefaultEntityMock {
    public static readonly ADMIN: any = {
        id: '5ca4b4648e20e14f9a8feef0',
        type: 'admin',
        email: 'admin@mail.com',
        password: 'admin123',
        birth_date: '1992-01-08',
        change_password: false,
        email_verified: true,
        phone_number: '(88) 98888-8888',
        total_pilot_studies: 1,
        total_patients: 1,
        total_admins: 1,
        total_health_professionals: 1,
        selected_pilot_study: '5ca23b9af04e7c28223cb590',
        language: 'pt-br'
    }

    public static readonly HEALTH_PROFESSIONAL: any = {
        id: '5ca4b4648c9d775c7eb9f8a2',
        type: 'health_professional',
        name: 'Health Mock',
        email: 'health@mail.com',
        password: 'health123',
        birth_date: '1992-01-08',
        change_password: false,
        email_verified: true,
        health_area: HealthAreaTypes.NUTRITION,
        phone_number: '(88) 98888-8888',
        total_pilot_studies: 1,
        total_patients: 1,
        selected_pilot_study: '5ca23b9af04e7c28223cb590',
        language: 'pt-br'
    }

    public static readonly PATIENT: any = {
        id: '5ca23b9af04e7c28223cb590',
        type: 'patient',
        name: 'Elvis Aaron',
        email: 'elvis@mail.com',
        password: 'patient123',
        birth_date: '1935-01-08',
        change_password: false,
        email_verified: true,
        gender: GenderTypes.MALE,
        phone_number: '(88) 98888-8888',
        selected_pilot_study: '5ca23b9af04e7c28223cb590',
        language: 'pt-br'
    }

    public static readonly PILOT_STUDY: any = {
        id: '5ca4b464f497945cb2041774',
        name: 'pilotstudy',
        is_active: true,
        start: '2019-03-15T00:00:00.000Z',
        end: '2019-04-15T23:59:59.000Z',
        total_patients: 1,
        total_health_professionals: 1,
        location: 'Mock Land'
    }

    public static readonly USER: any = {
        id: '5ca4b4648e20e14f9a8feef0',
        type: 'user',
        scopes: ['all'],
        email: 'user@mail.com',
        password: 'user123',
        birth_date: '1992-01-08',
        change_password: false,
        email_verified: true,
        phone_number: '(88) 98888-8888',
        selected_pilot_study: '5ca23b9af04e7c28223cb590',
        language: 'pt-br',
        last_sync: '2019-03-15T00:00:00.000Z',
        last_login: '2019-03-15T00:00:00.000Z'
    }
}
