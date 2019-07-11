import { IPilotStudyRepository } from '../../../src/application/port/pilot.study.repository.interface'
import { PilotStudy } from '../../../src/application/domain/model/pilot.study'
import { IQuery } from '../../../src/application/port/query.interface'
import { DefaultEntityMock } from '../models/default.entity.mock'
import { HealthProfessional } from '../../../src/application/domain/model/health.professional'
import { Patient } from '../../../src/application/domain/model/patient'

const pilotStudy: PilotStudy = new PilotStudy().fromJSON(DefaultEntityMock.PILOT_STUDY)
const health: HealthProfessional = new HealthProfessional().fromJSON(DefaultEntityMock.HEALTH_PROFESSIONAL)
const patient: Patient = new Patient().fromJSON(DefaultEntityMock.PATIENT)
health.id = DefaultEntityMock.HEALTH_PROFESSIONAL.id
pilotStudy.id = DefaultEntityMock.PILOT_STUDY.id
patient.id = DefaultEntityMock.PATIENT.id

export class PilotStudyRepositoryMock implements IPilotStudyRepository {

    public count(): Promise<number> {
        return Promise.resolve(1)
    }

    public create(item: PilotStudy): Promise<PilotStudy> {
        pilotStudy.health_professionals = []
        pilotStudy.patients = []
        return Promise.resolve(pilotStudy)
    }

    public delete(id: string): Promise<boolean> {
        return Promise.resolve(true)
    }

    public find(query: IQuery): Promise<Array<PilotStudy>> {
        pilotStudy.health_professionals = []
        pilotStudy.patients = []
        return Promise.resolve([pilotStudy])
    }

    public findOne(query: IQuery): Promise<PilotStudy> {
        pilotStudy.health_professionals = []
        pilotStudy.patients = []
        return Promise.resolve(pilotStudy)
    }

    public update(item: PilotStudy): Promise<PilotStudy> {
        pilotStudy.health_professionals = []
        pilotStudy.patients = []
        return Promise.resolve(pilotStudy)
    }

    public associateUser(pilotId: string, userId: string, userType: string): Promise<PilotStudy> {
        pilotStudy.health_professionals = []
        pilotStudy.patients = []
        return Promise.resolve(pilotStudy)
    }

    public checkExists(pilot: PilotStudy): Promise<boolean> {
        pilotStudy.health_professionals = []
        pilotStudy.patients = []
        return Promise.resolve(pilot.id === DefaultEntityMock.PILOT_STUDY.id)
    }

    public disassociateUser(pilotId: string, userId: string, userType: string): Promise<PilotStudy> {
        pilotStudy.health_professionals = []
        pilotStudy.patients = []
        return Promise.resolve(pilotStudy)
    }

    public findAndPopulate(query: IQuery): Promise<Array<PilotStudy>> {
        pilotStudy.health_professionals = []
        pilotStudy.patients = []
        return Promise.resolve([pilotStudy])
    }

    public findOneAndPopulate(query: IQuery): Promise<PilotStudy> {
        pilotStudy.health_professionals = [health]
        pilotStudy.patients = [patient]
        return Promise.resolve(pilotStudy)
    }

    public countHealthProfessionalsFromPilotStudy(pilotId: string): Promise<number> {
        return Promise.resolve(pilotId === pilotStudy.id ? 1 : 0)
    }

    public countPatientsFromHealthProfessional(healthId: string): Promise<number> {
        return Promise.resolve(1)
    }

    public countPatientsFromPilotStudy(pilotId: string): Promise<number> {
        return Promise.resolve(pilotId === pilotStudy.id ? 1 : 0)
    }

    public countPilotStudiesFromHealthProfessional(healthId: string): Promise<number> {
        return Promise.resolve(1)
    }

    public countPilotStudiesFromPatient(patientId: string): Promise<number> {
        return Promise.resolve(1)
    }
}
