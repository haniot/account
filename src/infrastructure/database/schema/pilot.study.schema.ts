import Mongoose, { Schema } from 'mongoose'
import { LanguageTypes } from '../../../application/domain/utils/language.types'

interface IPilotStudyModel extends Mongoose.Document {
}

const pilotStudySchema = new Mongoose.Schema({
        name: {
            type: String,
            required: 'Name is required!',
            index: { unique: true }
        },
        is_active: {
            type: Boolean,
            required: 'Pilot study status is required!'
        },
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        },
        health_professionals: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        patients: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        location: {
            type: String
        },
        language: {
            type: String,
            default: LanguageTypes.PT_BR
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: false },
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id
                delete ret._id
                delete ret.__v
                return ret
            }
        }
    }
)

export const PilotStudyRepoModel = Mongoose.model<IPilotStudyModel>('PilotStudy', pilotStudySchema)
