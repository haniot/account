import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { PilotStudy } from '../../application/domain/model/pilot.study'
import { PilotStudyEntity } from '../entity/pilot.study.entity'
import { IPilotStudyRepository } from '../../application/port/pilot.study.repository.interface'
import { Identifier } from '../../di/identifiers'
import { ILogger } from '../../utils/custom.logger'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { IQuery } from '../../application/port/query.interface'
import { Query } from './query/query'
import { UserType } from '../../application/domain/utils/user.type'
import { ObjectId } from 'bson'

@injectable()
export class PilotStudyRepository extends BaseRepository<PilotStudy, PilotStudyEntity> implements IPilotStudyRepository {
    constructor(
        @inject(Identifier.PILOT_STUDY_REPO_MODEL) readonly _pilotStudyModel: any,
        @inject(Identifier.PILOT_STUDY_ENTITY_MAPPER)
        readonly _pilotStudyEntityMapper: IEntityMapper<PilotStudy, PilotStudyEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_pilotStudyModel, _pilotStudyEntityMapper, _logger)
    }

    public findAndPopulate(query: IQuery): Promise<Array<PilotStudy>> {
        const q: any = query.toJSON()
        const populate_health_professionals: any = { path: 'health_professionals', select: {}, match: {} }
        const populate_patients: any = { path: 'patients', select: {}, match: {} }

        for (const key in q.filters) {
            if (key.startsWith('health_professionals.')) {
                populate_health_professionals.match[key.split('.')[1]] = q.filters[key]
                delete q.filters[key]
            } else if (key.startsWith('patients.')) {
                populate_patients.match[key.split('.')[1]] = q.filters[key]
                delete q.filters[key]
            }
        }

        for (const key in q.fields) {
            if (key.startsWith('health_professionals.')) {
                populate_health_professionals.select[key.split('.')[1]] = 1
                delete q.fields[key]
            } else if (key.startsWith('patients.')) {
                populate_patients.select[key.split('.')[1]] = 1
                delete q.fields[key]
            }
        }

        return new Promise<Array<PilotStudy>>((resolve, reject) => {
            this.Model.find(q.filters)
                .select(q.fields)
                .sort(q.ordination)
                .skip(Number((q.pagination.limit * q.pagination.page) - q.pagination.limit))
                .limit(Number(q.pagination.limit))
                .populate(populate_health_professionals)
                .populate(populate_patients)
                .exec()
                .then((result: Array<PilotStudy>) => resolve(
                    result
                        .filter(item => item.health_professionals!.length > 0)
                        .filter(item => item.patients!.length > 0)
                        .map(item => this.mapper.transform(item)))
                ).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public findOneAndPopulate(query: IQuery): Promise<PilotStudy> {
        const q: any = query.toJSON()
        const populate_health_professionals: any = { path: 'health_professionals', select: {}, match: {} }
        const populate_patients: any = { path: 'patients', select: {}, match: {} }

        for (const key in q.fields) {
            if (key.startsWith('health_professionals.')) {
                populate_health_professionals.select[key.split('.')[1]] = 1
                delete q.fields[key]
            } else if (key.startsWith('patients.')) {
                populate_patients.select[key.split('.')[1]] = 1
                delete q.fields[key]
            }
        }
        return new Promise<PilotStudy>((resolve, reject) => {
            this.Model.findOne(q.filters)
                .select(q.fields)
                .populate(populate_health_professionals)
                .populate(populate_patients)
                .exec()
                .then((result: PilotStudy) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                }).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public checkExists(pilot: PilotStudy): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            const query: Query = new Query()
            if (pilot.id) query.addFilter({ _id: pilot.id })
            if (pilot.name) query.addFilter({ name: pilot.name })
            this.findOne(query)
                .then(result => resolve(!!result))
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public associateUser(pilotId: string, userId: string, userType: string): Promise<PilotStudy> {
        return new Promise<PilotStudy>((resolve, reject) => {
            const update: any = { $addToSet: {} }
            update.$addToSet = userType === UserType.PATIENT ?
                { patients: new ObjectId(userId) } : { health_professionals: new ObjectId(userId) }
            this.Model.findOneAndUpdate({ _id: pilotId }, update)
                .exec()
                .then(result => {
                    if (!result) return resolve(undefined)

                    const query: Query = new Query()
                    query.addFilter({ _id: pilotId })

                    return resolve(this.findOneAndPopulate(query))
                }).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public disassociateUser(pilotId: string, userId: string, userType: string): Promise<PilotStudy> {
        const update: any = { $pull: {} }
        update.$pull = userType === UserType.PATIENT ?
            { patients: new ObjectId(userId) } : { health_professionals: new ObjectId(userId) }
        return new Promise<PilotStudy>((resolve, reject) => {
            this.Model.findOneAndUpdate({ _id: pilotId }, update)
                .exec()
                .then(result => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                }).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public count(): Promise<number> {
        return super.count(new Query())
    }

    public countHealthProfessionalsFromPilotStudy(pilotId: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            super.findOne(new Query().fromJSON({ filters: { _id: pilotId } }))
                .then(result => resolve(result && result.health_professionals ? result.health_professionals.length : 0))
                .catch(err => this.mongoDBErrorListener(err))
        })
    }

    public countPatientsFromPilotStudy(pilotId: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            super.findOne(new Query().fromJSON({ filters: { _id: pilotId } }))
                .then(result => resolve(result && result.patients ? result.patients.length : 0))
                .catch(err => this.mongoDBErrorListener(err))
        })
    }

    public async countPatientsFromHealthProfessional(healthId: string): Promise<number> {
        const pilots = await this.find(new Query().fromJSON({ filters: { health_professionals: healthId } }))
        let allPatients: Array<any> = []
        await pilots.forEach(pilot => allPatients = [...allPatients, ...pilot.patients!])
        return Promise.resolve(new Set(allPatients).size)
    }

    public countPilotStudiesFromPatient(patientId: string): Promise<number> {
        return super.count(new Query().fromJSON({ filters: { patients: new ObjectId(patientId) } }))
    }

    public countPilotStudiesFromHealthProfessional(healthId: string): Promise<number> {
        return super.count(new Query().fromJSON({ filters: { health_professionals: new ObjectId(healthId) } }))
    }
}
