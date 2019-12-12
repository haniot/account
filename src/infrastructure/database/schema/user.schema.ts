import Mongoose from 'mongoose'
import { LanguageTypes } from '../../../application/domain/utils/language.types'

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
            default: LanguageTypes.PT_BR
        },
        reset_password_token: { type: String },
        email: {
            type: String,
            unique: true,
            sparse: true
        },
        password: { type: String },
        phone_number: { type: String },
        birth_date: { type: String },
        name: { type: String },
        health_area: { type: String }, /* Health Professional Parameters*/
        gender: { type: String }, /* Patient Parameter*/
        protected: { /* For blocking (or not) deleting an Admin user. */
            type: Boolean,
            default: false
        },
        goals: {
            steps: {
                type: Number,
                required: true
            },
            calories: {
                type: Number,
                required: true
            },
            distance: {
                type: Number,
                required: true
            },
            active_minutes: {
                type: Number,
                required: true
            },
            sleep: {
                type: Number,
                required: true
            }
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
