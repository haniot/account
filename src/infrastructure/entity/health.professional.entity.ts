import { UserEntity } from './user.entity'

export class HealthProfessionalEntity extends UserEntity {
    public email?: string
    public name?: string
    public health_area?: string
}
