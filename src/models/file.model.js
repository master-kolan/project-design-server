import {defaultSchemaExtend, defaultSchemaOption} from "../utils/db";
import mongoose from 'mongoose';

const schema = {
    fileName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    type: String,
    lanesNum: Number,
    span: String,
    slope: Number,
    payload: String,
    designSpeed: Number,
    bridgeWidth: Number,
    updateBy: String
};

export const fileModel = mongoose.model('file', new mongoose.Schema(Object.assign(schema, defaultSchemaExtend), defaultSchemaOption), 'file');