import { IService } from './service.interface'
import { Patient } from '../domain/model/patient'

export interface IPatientService extends IService<Patient> {
    count(): Promise<number>
}
