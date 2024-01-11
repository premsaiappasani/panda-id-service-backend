import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    passwordEncrypted: {
        type: String,
        required: true
    },
    isExpert: {
        type: Boolean
    },
    isAfricanOrg: {
        type: Boolean
    }
}, { timestamps: true });

UserSchema.index({ email: 1 }, { unique: true });

const user = mongoose.model("User", UserSchema);

export default user