import { HealthAreaTypes } from '../../../src/application/domain/utils/health.area.types'
import { GenderTypes } from '../../../src/application/domain/utils/gender.types'

export abstract class DefaultEntityMock {
    public static readonly ADMIN: any = {
        id: '5ca4b4648e20e14f9a8feef0',
        scopes: ['any'],
        type: 'admin',
        name: 'Admin Mock',
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
        language: 'pt-BR',
        last_login: '2019-03-15T00:00:00.000Z',
        last_sync: '2019-04-15T23:59:59.000Z'
    }

    public static readonly HEALTH_PROFESSIONAL: any = {
        id: '5ca4b4648c9d775c7eb9f8a2',
        scopes: ['all'],
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
        last_login: '2019-03-15T00:00:00.000Z',
        last_sync: '2019-04-15T23:59:59.000Z',
        language: 'pt-BR'

    }

    public static readonly PATIENT: any = {
        id: '5ca23b9af04e7c28223cb590',
        scopes: ['all'],
        type: 'patient',
        name: 'Elvis Aaron',
        email: 'elvis@mail.com',
        password: 'patient123',
        birth_date: '1935-01-08',
        change_password: false,
        email_verified: true,
        gender: GenderTypes.MALE,
        address: 'Av. Juvêncio Arruda, S/N - Universitário, Campina Grande - PB, 58429-600',
        phone_number: '(88) 98888-8888',
        selected_pilot_study: '5ca23b9af04e7c28223cb590',
        last_login: '2019-03-15T00:00:00.000Z',
        last_sync: '2019-04-15T23:59:59.000Z',
        language: 'pt-BR'
    }

    public static readonly GOAL: any = {
        steps: 10000,
        calories: 2600,
        distance: 8000,
        active_minutes: 60,
        sleep: 480
    }

    public static readonly PILOT_STUDY: any = {
        id: '5ca4b464f497945cb2041774',
        name: 'pilotstudy',
        is_active: true,
        start: '2019-03-15T00:00:00.000Z',
        end: '2019-04-15T23:59:59.000Z',
        total_patients: 1,
        total_health_professionals: 1,
        location: 'Mock Land',
        health_professionals: [DefaultEntityMock.HEALTH_PROFESSIONAL.id],
        patients: [DefaultEntityMock.PATIENT.id]
    }

    public static readonly PILOT_STUDY_BASIC: any = {
        id: '5ca4b464f497945cb2041774',
        name: 'pilotstudy',
        is_active: true,
        start: '2019-03-15T00:00:00.000Z',
        end: '2019-04-15T23:59:59.000Z',
        total_patients: 0,
        total_health_professionals: 0,
        location: 'Mock Land'
    }

    public static readonly USER: any = {
        id: '5ca4b4648e20e14f9a8feef0',
        type: 'user',
        scopes: ['all'],
        name: 'User Mock',
        email: 'user@mail.com',
        password: 'user123',
        birth_date: '1992-01-08',
        change_password: false,
        email_verified: true,
        phone_number: '(88) 98888-8888',
        selected_pilot_study: '5ca23b9af04e7c28223cb590',
        language: 'pt-BR',
        last_sync: '2019-03-15T00:00:00.000Z',
        last_login: '2019-03-15T00:00:00.000Z',
        reset_password_token: 'token'
    }

    public static readonly EMAIL: any = {
        to: 'you@mail.com',
        action_url: 'any@url.com',
        password: 'password',
        lang: 'pt_BR'
    }
}
