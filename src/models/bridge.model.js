import {defaultSchemaExtend, defaultSchemaOption} from "../utils/db";
import mongoose from 'mongoose';

const schema = {
    bridgeName: {
        type: String,
        required: true
    },
    path: String,
    class: String,
    centerPileNo: String,
    spanArrangement: String,
    obliqueAngle: Number,
    topStruct: String,
    bottomStruct: String,
    classTemplate: String,
    className: String,
    prefix: String,
    createdBy: String
};

export const BridgeModel = mongoose.model('bridge', new mongoose.Schema(Object.assign(schema, defaultSchemaExtend), defaultSchemaOption), 'bridge');