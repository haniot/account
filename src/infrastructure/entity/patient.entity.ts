import { UserEntity } from './user.entity'

export class PatientEntity extends UserEntity {
    public id?: string
    public name?: string
    public email?: string
    public gender?: string
    public birth_date?: string
    public pilotstudy_id?: string
}
