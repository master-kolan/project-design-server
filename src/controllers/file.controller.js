import baseController from "./base.controller";
import {generateResponse, UUID} from "../utils";
import {fileModel} from "../models/file.model";
const fs = require("fs")
const path = require('path')

class FileController extends baseController{
    constructor() {
        super(fileModel);
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
            params.fileName =  {$regex: params.fileName, $options:'i'}
            const count = await fileModel.countDocuments(params)
            const findRes = await fileModel.find(params).skip((current - 1) * pageSize).limit(pageSize).sort(sort)
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
            const result = await fileModel.create(fileInfo);
            ctx.response.body = generateResponse(result);
        } catch (err) {
            console.log(err);
            ctx.response.body = generateResponse(err, 502, '系统正忙');
        }
    }

    async edit(ctx) {
        let fileInfo = ctx.request.body;
        try {
            const result = await fileModel.updateOne({_id: fileInfo._id}, {$set:fileInfo});
            ctx.response.body = generateResponse(result);
        } catch (err) {
            console.log(err);
            ctx.response.body = generateResponse(err, 502, '系统正忙');
        }
    }

    async delete(ctx) {
        let {_id} = ctx.request.body;
        try {
            const result = await fileModel.deleteOne({_id});
            ctx.response.body = generateResponse(result);
        } catch (err) {
            console.log(err);
            ctx.response.body = generateResponse(err, 502, '系统正忙');
        }
    }

    async upload (ctx, next) {
        const file = ctx.request.files.file;
        const extname = path.extname(file.name);
        const fileName = file.name.split('.')[0] + UUID() + extname;
        const destinationPath = path.join(__dirname, '../../public/uploads/' + fileName);
        ctx.request.body = {
            readPath: file.path,
            writePath: destinationPath,
            fileName
        }
        await next();
    }

    async writeFile(ctx) {
        let {readPath, writePath,fileName} = ctx.request.body;
        const read = fs.createReadStream(readPath);
        const writer = fs.createWriteStream(writePath);
        read.pipe(writer);
        ctx.response.body = generateResponse( {
            path: ctx.request.origin + '/uploads/' + fileName
        })
    }
}

export default FileController;