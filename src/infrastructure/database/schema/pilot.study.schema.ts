import Mongoose, { Schema } from 'mongoose'

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
        health_professionals_id: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
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
