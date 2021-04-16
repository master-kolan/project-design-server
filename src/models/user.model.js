import {defaultSchemaExtend, defaultSchemaOption} from "../utils/db";
import mongoose from 'mongoose';

const schema = {
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: String,
    pwdSalt: String,
    userType: String
};

export const userModel = mongoose.model('user', new mongoose.Schema(Object.assign(schema, defaultSchemaExtend), defaultSchemaOption), 'user');