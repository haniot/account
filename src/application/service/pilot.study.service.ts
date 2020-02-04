import { inject, injectable } from 'inversify'
import { IPilotStudyService } from '../port/pilot.study.service.interface'
import { PilotStudy } from '../domain/model/pilot.study'
import { IQuery } from '../port/query.interface'
import { Identifier } from '../../di/identifiers'
import { IPilotStudyRepository } from '../port/pilot.study.repository.interface'
import { CreatePilotStudyValidator } from '../domain/validator/create.pilot.study.validator'
import { UpdatePilotStudyValidator } from '../domain/validator/update.pilot.study.validator'
import { IHealthProfessionalRepository } from '../port/health.professional.repository.interface'
import { ValidationException } from '../domain/exception/validation.exception'
import { Strings } from '../../utils/strings'
import { HealthProfessional } from '../domain/model/health.professional'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { Patient } from '../domain/model/patient'
import { IPatientRepository } from '../port/patient.repository.interface'
import { UserType } from '../domain/utils/user.type'
import { IntegrationEvent } from '../integration-event/event/integration.event'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { IIntegrationEventRepository } from '../port/integration.event.repository.interface'
import { ILogger } from '../../utils/custom.logger'
import { PilotStudyDeleteEvent } from '../integration-event/event/pilot.study.delete.event'
import { Query } from '../../infrastructure/repository/query/query'

@injectable()
export class PilotStudyService implements IPilotStudyService {
    constructor(
        @inject(Identifier.PILOT_STUDY_REPOSITORY) private readonly _pilotStudyRepository: IPilotStudyRepository,
        @inject(Identifier.HEALTH_PROFESSIONAL_REPOSITORY)
        private readonly _healthProfessionalRepository: IHealthProfessionalRepository,
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.INTEGRATION_EVENT_REPOSITORY) private readonly _integrationEventRepo: IIntegrationEventRepository,
        @inject(Identifier.PATIENT_REPOSITORY) private readonly _patientRepository: IPatientRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async add(item: PilotStudy): Promise<PilotStudy> {
        try {
            CreatePilotStudyValidator.validate(item)
            const result: PilotStudy = await this._pilotStudyRepository.create(item)
            return Promise.resolve(this.addReadOnlyInformation(result))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAll(query: IQuery): Promise<Array<PilotStudy>> {
        const result: Array<PilotStudy> = await this._pilotStudyRepository.find(query)
        return Promise.resolve(this.addMultipleReadOnlyInformation(result))
    }

    public async getById(id: string, query: IQuery): Promise<PilotStudy> {
        try {
            ObjectIdValidator.validate(id)
            query.addFilter({ _id: id })
            const result: PilotStudy = await this._pilotStudyRepository.findOne(query)
            return Promise.resolve(this.addReadOnlyInformation(result))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async remove(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id)
            const associatedHealths: number = await this._pilotStudyRepository.countHealthProfessionalsFromPilotStudy(id)
            const associatedPatients: number = await this._pilotStudyRepository.countPatientsFromPilotStudy(id)

            if (associatedHealths || associatedPatients) {
                throw new ValidationException(Strings.PILOT_STUDY.HAS_ASSOCIATION)
            }
            const pilot: PilotStudy = await this._pilotStudyRepository.findOne(new Query().fromJSON({ filters: { _id: id } }))
            const result: boolean = await this._pilotStudyRepository.delete(id)
            if (result) await this.publishEvent(new PilotStudyDeleteEvent(new Date(), pilot), 'pilotstudies.delete')

            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async update(item: PilotStudy): Promise<PilotStudy> {
        try {
            UpdatePilotStudyValidator.validate(item)
            const result: PilotStudy = await this._pilotStudyRepository.update(item)
            return Promise.resolve(this.addReadOnlyInformation(result))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public count(query: IQuery): Promise<number> {
        try {
            return this._pilotStudyRepository.count(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAllPilotStudiesFromHealthProfessional(healthId: string, query: IQuery): Promise<Array<PilotStudy>> {
        try {
            ObjectIdValidator.validate(healthId)
            return this.getAll(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAllPilotStudiesFromPatient(patientId: string, query: IQuery): Promise<Array<PilotStudy>> {
        try {
            ObjectIdValidator.validate(patientId)
        } catch (err) {
            return Promise.reject(err)
        }
        return this.getAll(query)
    }

    public async associateHealthProfessional(pilotId: string, healthId: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(pilotId)
            ObjectIdValidator.validate(healthId)

            const pilotExist: boolean = await this._pilotStudyRepository.checkExists(new PilotStudy().fromJSON(pilotId))
            if (!pilotExist) throw new ValidationException(Strings.PILOT_STUDY.ASSOCIATION_FAILURE)

            const healthExists = await this._healthProfessionalRepository.checkExists(new HealthProfessional().fromJSON(healthId))
            if (!healthExists) throw new ValidationException(Strings.HEALTH_PROFESSIONAL.ASSOCIATION_FAILURE)

            const result: PilotStudy =
                await this._pilotStudyRepository.associateUser(pilotId, healthId, UserType.HEALTH_PROFESSIONAL)
            return Promise.resolve(!!result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async disassociateHealthProfessional(pilotId: string, healthId: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(pilotId)
            ObjectIdValidator.validate(healthId)

            const result: PilotStudy =
                await this._pilotStudyRepository.disassociateUser(pilotId, healthId, UserType.HEALTH_PROFESSIONAL)
            return Promise.resolve(!!result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAllHealthProfessionals(pilotId: string, query: IQuery): Promise<Array<HealthProfessional>> {
        try {
            ObjectIdValidator.validate(pilotId)
            query.addFilter({ _id: pilotId })

            const result: PilotStudy = await this._pilotStudyRepository.findOneAndPopulate(query)
            return Promise.resolve(result && result.health_professionals ? result.health_professionals : [])
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async associatePatient(pilotId: string, patientId: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(pilotId)
            ObjectIdValidator.validate(patientId)

            const pilotExist: boolean = await this._pilotStudyRepository.checkExists(new PilotStudy().fromJSON(pilotId))
            if (!pilotExist) throw new ValidationException(Strings.PILOT_STUDY.ASSOCIATION_FAILURE)

            const patientExists = await this._patientRepository.checkExists(new Patient().fromJSON(patientId))
            if (!patientExists) throw new ValidationException(Strings.PATIENT.ASSOCIATION_FAILURE)

            const result: PilotStudy = await this._pilotStudyRepository.associateUser(pilotId, patientId, UserType.PATIENT)
            return Promise.resolve(!!result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async disassociatePatient(pilotId: string, patientId: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(pilotId)
            ObjectIdValidator.validate(patientId)

            const result: PilotStudy = await this._pilotStudyRepository.disassociateUser(pilotId, patientId, UserType.PATIENT)
            return Promise.resolve(!!result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async getAllPatients(pilotId: string, query: IQuery): Promise<Array<Patient>> {
        try {
            ObjectIdValidator.validate(pilotId)
            query.addFilter({ _id: pilotId })

            const result: PilotStudy = await this._pilotStudyRepository.findOneAndPopulate(query)
            return Promise.resolve(result && result.patients ? result.patients : [])
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public countPilotStudiesFromHealthProfessional(healthId: string): Promise<number> {
        try {
            ObjectIdValidator.validate(healthId)
            return this._pilotStudyRepository.countPilotStudiesFromHealthProfessional(healthId)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public countPilotStudiesFromPatient(patientId: string): Promise<number> {
        try {
            ObjectIdValidator.validate(patientId)
            return this._pilotStudyRepository.countPilotStudiesFromPatient(patientId)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public countPatientsFromPilotStudy(pilotId: string): Promise<number> {
        try {
            ObjectIdValidator.validate(pilotId)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._pilotStudyRepository.countPatientsFromPilotStudy(pilotId)
    }

    public countHealthProfessionalsFromPilotStudy(pilotId: string): Promise<number> {
        try {
            ObjectIdValidator.validate(pilotId)
        } catch (err) {
            return Promise.reject(err)
        }
        return this._pilotStudyRepository.countHealthProfessionalsFromPilotStudy(pilotId)
    }

    private async addMultipleReadOnlyInformation(item: Array<PilotStudy>): Promise<Array<PilotStudy>> {
        if (item && item.length) {
            try {
                for (let i = 0; i < item.length; i++) item[i] = await this.addReadOnlyInformation(item[i])
            } catch (err) {
                return Promise.reject(err)
            }
        }
        return Promise.resolve(item)
    }

    private async addReadOnlyInformation(item: PilotStudy): Promise<PilotStudy> {
        if (item) {
            try {
                item.total_health_professionals =
                    item.health_professionals && item.health_professionals.length ? item.health_professionals.length : 0
                item.total_patients = item.patients && item.patients.length ? item.patients.length : 0
            } catch (err) {
                return Promise.reject(err)
            }
        }
        return item
    }

    private async publishEvent(event: IntegrationEvent<PilotStudy>, routingKey: string): Promise<void> {
        try {
            const successPublish = await this._eventBus.publish(event, routingKey)
            if (!successPublish) throw new Error('')
            this._logger.info(`Pilot Study with ID: ${event.toJSON().pilot_study.id} has been deleted and published on ` + '' +
                'event bus...')
        } catch (err) {
            const saveEvent: any = event.toJSON()
            this._integrationEventRepo.create({
                ...saveEvent,
                __routing_key: routingKey,
                __operation: 'publish'
            })
                .then(() => {
                    this._logger.warn(`Could not publish the event named ${event.event_name}.`
                        .concat(` The event was saved in the database for a possible recovery.`))
                })
                .catch(err => {
                    this._logger.error(`There was an error trying to save the name event: ${event.event_name}.`
                        .concat(`Error: ${err.message}. Event: ${JSON.stringify(saveEvent)}`))
                })
        }
    }
}
