import baseController from "./base.controller";
import {generateResponse, SECRET} from "../utils";
import {userModel} from "../models/user.model";
const jwt = require('jsonwebtoken');

class UserController extends baseController{
    constructor() {
        super(userModel);
    }
    async login(ctx) {
        const {username, password} = ctx.request.body
        try {
            const findRes = await userModel.findOne({
                username
            });
            if (findRes && findRes.password === password) { //不存在
                const {username, id } = findRes;
                const userToken = {
                    id
                };
                ctx.response.body = generateResponse({
                    username,
                    accessToken: jwt.sign(userToken, SECRET, {expiresIn: '1h'}),
                    refreshToken: jwt.sign(userToken, SECRET, {expiresIn: '4h'})
                });
            } else {
                ctx.response.body = generateResponse({}, 401, '用户不存在或密码错误')
            }
        } catch (err) {
            console.log(err);
            ctx.response.body = generateResponse(err, 502, '系统正忙');
        }
    }
    // async register(userInfo) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const findRes = await this.findOne({
    //                 username: userInfo.username,
    //                 password: userInfo.password
    //             })
    //             if (!findRes) { //不存在
    //                 const createRes = await this.create(roleInfo) //新增
    //                 //返回结果
    //                 resolve(createRes)
    //             } else {
    //                 reject({
    //                     code: SERVER_CONFIG.REQ_CODE.ERROR_USER_ALREADY_EXISTS
    //                 })
    //             }
    //         } catch (err) {
    //             reject(err)
    //         }
    //     })
    // }
    async list(ctx) {
        const {pagination, params, sort} = ctx.request.body
        try {
            let {
                current,
                pageSize
            } = pagination
            current = Number(current)
            pageSize = Number(pageSize)
            params.username =  {$regex: params.username, $options:'i'}
            const count = await userModel.countDocuments(params)
            const findRes = await userModel.find(params).skip((current - 1) * pageSize).limit(pageSize).sort(sort)
            ctx.response.body = generateResponse({
                count,
                list: findRes
            });
        } catch (err) {
            console.log(err);
            ctx.response.body = generateResponse(err, 502, '系统正忙');
        }
    }

    async create(ctx) {
        let userInfo = ctx.request.body;
        try {
            const hasUser = await userModel.findOne({username: userInfo.username});
            if (hasUser) {
                ctx.response.body = generateResponse({}, 502, '用户名称重复');
            } else {
                const result = await userModel.create(userInfo);
                ctx.response.body = generateResponse({});
            }
        } catch (err) {
            console.log(err);
            ctx.response.body = generateResponse(err, 502, '系统正忙');
        }
    }

    async edit(ctx) {
        let userInfo = ctx.request.body;
        try {
            const result = await userModel.updateOne({_id: userInfo._id}, {$set:userInfo});
            ctx.response.body = generateResponse(result);
        } catch (err) {
            console.log(err);
            ctx.response.body = generateResponse(err, 502, '系统正忙');
        }
    }

    async delete(ctx) {
        let {_id} = ctx.request.body;
        try {
            const result = await userModel.deleteOne({_id});
            console.log(result);
            ctx.response.body = generateResponse(result);
        } catch (err) {
            console.log(err);
            ctx.response.body = generateResponse(err, 502, '系统正忙');
        }
    }
}
export default UserController;