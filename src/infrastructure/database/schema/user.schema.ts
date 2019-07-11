import Mongoose from 'mongoose'

interface IUserModel extends Mongoose.Document {
}

const userSchema = new Mongoose.Schema({
        type: { type: String },
        scopes: [{ type: String }],
        change_password: { type: Boolean },
        email_verified: { type: Boolean },
        last_login: { type: Date },
        last_sync: { type: Date },
        selected_pilot_study: { type: String },
        language: {
            type: String,
            default: 'pt-br'
        },
        email: {
            type: String,
            required: 'Email of user is required!',
            unique: true
        },
        password: {
            type: String,
            required: 'Password for user authentication is required!'
        },
        phone_number: { type: String },
        birth_date: { type: String },
        name: { type: String }, /* Patient and Health Professional Parameters */
        health_area: { type: String }, /* Health Professional Parameters*/
        gender: { type: String } /* Patient Parameter*/
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
