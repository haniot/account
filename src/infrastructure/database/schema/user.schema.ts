import Mongoose, { Schema } from 'mongoose'

interface IUserModel extends Mongoose.Document {
}

const userSchema = new Mongoose.Schema({
        password: {
            type: String
        },
        type: {
            type: String
        },
        change_password: {
            type: Boolean
        },
        scopes: [{ type: String }],
        email: { /* Common parameter between admin, patient and health professional. */
            type: String
        }, /* Health Professional parameters*/
        name: {
            type: String
        },
        health_area: {
            type: String
        }, /* Patient parameters */
        gender: {
            type: String
        },
        birth_date: {
            type: String
        },
        pilotstudy_id: {
            type: Schema.Types.ObjectId,
            ref: 'PilotStudy'
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

export const UserRepoModel = Mongoose.model<IUserModel>('User', userSchema)
