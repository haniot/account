import { UserEntity } from './user.entity'

export class PatientEntity extends UserEntity {
    public name?: string
    public gender?: string
}
