import baseController from "./base.controller";
import {BridgeModel} from "../models/bridge.model";
import {generateResponse} from "../utils";
const child = require('child_process');

class BridgeController extends baseController {
    constructor() {
        super(BridgeModel);
    }

    async list(ctx) {
        const {pagination, params, sort} = ctx.request.body
        try {
            let {
                current,
                pageSize
            } = pagination
            current = Number(current)
            pageSize = Number(pageSize)
            params.bridgeName =  {$regex: params.bridgeName, $options:'i'}
            const count = await BridgeModel.countDocuments(params)
            const findRes = await BridgeModel.find(params).skip((current - 1) * pageSize).limit(pageSize).sort(sort)
            ctx.response.body = generateResponse({
                count,
                list: findRes
            });
        } catch (err) {
            ctx.response.body = generateResponse(err, 502, '系统正忙');
        }
    }

    async create(ctx) {
        let fileInfo = ctx.request.body;
        try {
            fileInfo.topStruct = JSON.stringify(fileInfo.topStruct);
            fileInfo.bottomStruct = JSON.stringify(fileInfo.bottomStruct);
            const result = await BridgeModel.create(fileInfo);
            ctx.response.body = generateResponse(result);
        } catch (err) {
            console.log(err);
            ctx.response.body = generateResponse(err, 502, '系统正忙');
        }
    }

    async edit(ctx) {
        let bridgeInfo = ctx.request.body;
        try {
            bridgeInfo.topStruct = JSON.stringify(bridgeInfo.topStruct);
            bridgeInfo.bottomStruct = JSON.stringify(bridgeInfo.bottomStruct);
            const result = await BridgeModel.updateOne({_id: bridgeInfo._id}, {$set:bridgeInfo});
            ctx.response.body = generateResponse(result);
        } catch (err) {
            console.log(err);
            ctx.response.body = generateResponse(err, 502, '系统正忙');
        }
    }

    async delete(ctx) {
        let {_id} = ctx.request.body;
        try {
            const result = await BridgeModel.deleteOne({_id});
            ctx.response.body = generateResponse(result);
        } catch (err) {
            console.log(err);
            ctx.response.body = generateResponse(err, 502, '系统正忙');
        }
    }

    async exec(ctx) {
        try {
            child.execSync('D:\\软件\\新建文件夹\\20210129.1.release.nopdb\\x64\\Release\\bin\\BridgeDesigner.exe');
            ctx.response.body = generateResponse({});
        } catch (err) {
            ctx.response.body = generateResponse({}, 502, err)
        }
    }
}
export default BridgeController;