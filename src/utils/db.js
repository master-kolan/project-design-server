import {db} from "../../config.json";
import mongoose from "mongoose";

export const defaultSchemaExtend = {
    createTime: {
        type: Date,
        default: Date.now()
    },
    updateTime: {
        type: Date,
        default: Date.now()
    }
}

export const defaultSchemaOption = {
    timestamps: {
        createAt: 'createTime',
        updateAt: 'updateTime'
    }
}

export function setup() {
    const Account = db.user ? `${db.user}:${db.pass}@` : ''; //是否有账号和密码
    mongoose.connect(`mongodb://${Account}127.0.0.1:${db.port}/${db.DATABASE}`, {
        useNewUrlParser: true
    }, err => {
        if (!err) {
            mongoose.set('useFindAndModify', false)
            console.log(new Date().toLocaleString(), '数据库' + db.DATABASE + '已连接成功')
        } else {
            console.error(err)
        }
    })
}