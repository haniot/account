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
        return new Promise<Array<PilotStudy>>((resolve, reject) => {
            this.Model.find(q.filters)
                .select(q.fields)
                .sort(q.ordination)
                .skip(Number((q.pagination.limit * q.pagination.page) - q.pagination.limit))
                .limit(Number(q.pagination.limit))
                .populate('health_professionals')
                .populate('patients')
                .exec()
                .then((result: Array<PilotStudy>) => resolve(result.map(item => this.mapper.transform(item))))
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public findOneAndPopulate(query: IQuery): Promise<PilotStudy> {
        const q: any = query.toJSON()
        const pilotFilter: any = { _id: q.filters._id }
        delete q.filters._id
        return new Promise<PilotStudy>((resolve, reject) => {
            this.Model.findOne(pilotFilter)
                .select(q.fields)
                .populate({
                    path: 'health_professionals',
                    match: q.filters,
                    options: {
                        sort: q.ordination,
                        skip: Number((q.pagination.limit * q.pagination.page) - q.pagination.limit),
                        limit: Number(q.pagination.limit)
                    }
                })
                .populate({
                    path: 'patients',
                    match: q.filters,
                    options: {
                        sort: q.ordination,
                        skip: Number((q.pagination.limit * q.pagination.page) - q.pagination.limit),
                        limit: Number(q.pagination.limit)
                    }
                })
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
            update.$addToSet = userType === UserType.PATIENT ? { patients: userId } : { health_professionals: userId }
            this.Model.findOneAndUpdate({ _id: pilotId }, update)
                .exec()
                .then(result => resolve(!result ? undefined : this.mapper.transform(result)))
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public disassociateUser(pilotId: string, userId: string, userType: string): Promise<PilotStudy> {
        const update: any = { $pull: {} }
        update.$pull = userType === UserType.PATIENT ? { patients: userId } : { health_professionals: userId }
        return new Promise<PilotStudy>((resolve, reject) => {
            this.Model.findOneAndUpdate({ _id: pilotId }, update)
                .exec()
                .then(result => resolve(!result ? undefined : this.mapper.transform(result)))
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public count(): Promise<number> {
        return super.count(new Query())
    }

    public countHealthProfessionalsFromPilotStudy(pilotId: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            super.findOne(new Query().fromJSON({ filters: { _id: pilotId } }))
                .then(result => resolve(result && result.health_professionals ? result.health_professionals.length : 0))
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public countPatientsFromPilotStudy(pilotId: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            super.findOne(new Query().fromJSON({ filters: { _id: pilotId } }))
                .then(result => resolve(result && result.patients ? result.patients.length : 0))
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public async countPatientsFromHealthProfessional(healthId: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            return this.Model.distinct('patients', { health_professionals: healthId })
                .then(result => resolve(result && result.length ? result.length : 0))
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public countPilotStudiesFromPatient(patientId: string): Promise<number> {
        return super.count(new Query().fromJSON({ filters: { patients: patientId } }))
    }

    public countPilotStudiesFromHealthProfessional(healthId: string): Promise<number> {
        return super.count(new Query().fromJSON({ filters: { health_professionals: healthId } }))
    }
}
