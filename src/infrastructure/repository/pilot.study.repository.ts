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
import { ValidationException } from '../../application/domain/exception/validation.exception'

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

    public create(item: PilotStudy): Promise<PilotStudy> {
        const itemNew: PilotStudy = this.mapper.transform(item)
        return new Promise<PilotStudy>((resolve, reject) => {
            return this.Model.create(itemNew)
                .then(result => {
                    if (!result) return resolve(undefined)

                    const query = new Query()
                    query.addFilter({ _id: result.id })

                    return resolve(this.findOne(query))
                }).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public find(query: IQuery): Promise<Array<PilotStudy>> {
        const q: any = query.toJSON()
        const populate: any = { path: 'health_professionals_id', select: {}, match: {} }

        for (const key in q.filters) {
            if (key.startsWith('health_professionals_id.')) {
                populate.match[key.split('.')[1]] = q.filters[key]
                delete q.filters[key]
            }
        }

        for (const key in q.fields) {
            if (key.startsWith('health_professionals_id.')) {
                populate.select[key.split('.')[1]] = 1
                delete q.fields[key]
            }
        }

        return new Promise<Array<PilotStudy>>((resolve, reject) => {
            this.Model.find(q.filters)
                .select(q.fields)
                .sort(q.ordination)
                .skip(Number((q.pagination.limit * q.pagination.page) - q.pagination.limit))
                .limit(Number(q.pagination.limit))
                .populate(populate)
                .exec()
                .then((result: Array<PilotStudy>) => resolve(
                    result
                        .filter(item => item.health_professionals_id!.length > 0)
                        .map(item => this.mapper.transform(item)))
                ).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public findOne(query: IQuery): Promise<PilotStudy> {
        const q: any = query.toJSON()
        const populate: any = { path: 'health_professionals_id', select: {} }

        for (const key in q.fields) {
            if (key.startsWith('health_professionals_id.')) {
                populate.select[key.split('.')[1]] = 1
                delete q.fields[key]
            }
        }

        return new Promise<PilotStudy>((resolve, reject) => {
            this.Model.findOne(q.filters)
                .select(q.fields)
                .populate(populate)
                .exec()
                .then((result: PilotStudy) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                }).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public update(item: PilotStudy): Promise<PilotStudy> {
        const itemUp: any = this.mapper.transform(item)
        return new Promise<PilotStudy>((resolve, reject) => {
            this.Model.findOneAndUpdate({ _id: itemUp.id }, itemUp, { new: true })
                .populate('health_professionals_id')
                .exec()
                .then((result: PilotStudy) => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                }).catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public checkExists(pilotStudies: PilotStudy | Array<PilotStudy>): Promise<boolean | ValidationException> {
        const query: Query = new Query()
        return new Promise<boolean | ValidationException>((resolve, reject) => {
            if (pilotStudies instanceof Array) {
                if (pilotStudies.length === 0) return resolve(false)

                let count = 0
                const resultPilotStudiesIds: Array<string> = []

                pilotStudies.forEach((pilot: PilotStudy) => {
                    if (pilot.id) query.filters = { _id: pilot.id }
                    else if (pilot.name) query.filters = { name: pilot.name }

                    this.findOne(query)
                        .then(result => {
                            count++
                            if (!result && pilot.id) resultPilotStudiesIds.push(pilot.id)
                            if (count === pilotStudies.length) {
                                if (resultPilotStudiesIds.length > 0) {
                                    return resolve(new ValidationException(resultPilotStudiesIds.join(', ')))
                                }
                                return resolve(true)
                            }
                        }).catch(err => reject(super.mongoDBErrorListener(err)))
                })
            } else {
                if (pilotStudies.id) query.filters = { _id: pilotStudies.id }
                else if (pilotStudies.name) query.filters = { name: pilotStudies.name }

                this.findOne(query)
                    .then(result => {
                        if (!result) return resolve(false)
                        return resolve(true)
                    }).catch(err => reject(super.mongoDBErrorListener(err)))
            }
        })
    }
}
