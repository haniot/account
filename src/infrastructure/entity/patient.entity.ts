import { UserEntity } from './user.entity'

export class PatientEntity extends UserEntity {
    public id?: string
    public name?: string
    public gender?: string
    public birth_date?: string
    public pilot_studies?: Array<any>
}
