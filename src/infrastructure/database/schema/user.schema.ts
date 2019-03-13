import Mongoose from 'mongoose'

interface IUserModel extends Mongoose.Document {
}

const userSchema = new Mongoose.Schema({
        username: {
            type: String,
            required: 'Name required!',
            index: { unique: true }
        },
        password: {
            type: String,
            required: 'Password required!'
        },
        type: {
            type: String
        },
        change_password: {
            type: Boolean
        },
        email: { /* Common parameter between admin and health professional. */
            type: String,
            index: { unique: true },
            required: 'Email required!'
        }, /* Health Professional parameters*/
        name: {
            type: String
        },
        health_area: {
            type: String
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
