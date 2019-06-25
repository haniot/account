import { UserEntity } from './user.entity'

export class HealthProfessionalEntity extends UserEntity {
    public name?: string
    public health_area?: string
    public pilot_studies?: Array<any>
}
