import Mongoose from 'mongoose'

interface IUserModel extends Mongoose.Document {
}

const userSchema = new Mongoose.Schema({
        email: {
            type: String,
            required: 'Email required!',
            index: { unique: true }
        },
        password: {
            type: String,
            required: 'Password requried!'
        },
        type: {
            type: Number,
            required: 'Type is required!'
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: false },
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id
                delete ret._id
                delete ret.__v
                delete ret.updatedAt
                return ret
            }
        }
    }
)

export const UserRepoModel = Mongoose.model<IUserModel>('User', userSchema)
