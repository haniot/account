import { UserEntity } from './user.entity'

export class PatientEntity extends UserEntity {
    public gender?: string
    public address?: string
    public goals?: any                  // Patient goals
    public external_services?: any      // External Patient services
}
