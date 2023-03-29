import mongoose from "mongoose";

const usersCollection = 'users';

const stringNoUniqueRequired = {
    type: String,
    required: true
};

const numberNoUniqueRequired = {
    type: Number,
    required: true
};

const stringUniqueRequired = {
    type: String,
    required: true,
    unique: true
}
const userSchema = new mongoose.Schema({
    first_name: stringNoUniqueRequired,
    last_name:stringNoUniqueRequired,
    email:stringUniqueRequired,
    age: numberNoUniqueRequired,
    password: String,
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin'],
    },
})

export const userModel = mongoose.model(usersCollection, userSchema);
