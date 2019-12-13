import { UserEntity } from './user.entity'

export class PatientEntity extends UserEntity {
    public gender?: string
    public goals?: any      // Patient goals
}
