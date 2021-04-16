import {setup} from "./src/utils/db";
import {SECRET} from "./src/utils";

const Koa = require('koa');
const app = new Koa();
const config = require('./config.json');
const router = require('./src/router');
const koaBody = require('koa-body');
const koaJwt = require('koa-jwt');
const serve = require('koa-static'); // 引入静态资源中间件
const path = require('path');
const jwt = require('jsonwebtoken');

setup();

// pdf文件下载
app.use(async (ctx, next) => {
    if (/\.pdf$/.test(ctx.path)) {
        ctx.set("Content-Type", "application/octet-strea");
    }
    await next();
});

// 指定当前静态资源的文件夹
app.use(serve(path.join(__dirname,'./public')));

// 处理跨域
app.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*")
    ctx.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    ctx.set("Access-Control-Max-Age", "3600");
    ctx.set("Access-Control-Allow-Headers", "x-requested-with,Authorization,Content-Type,Accept");
    ctx.set("Access-Control-Allow-Credentials", "true");
    if (ctx.method === 'OPTIONS') {
        ctx.response.status = 200;
        return;
    }
    try {
        await next();
    } catch (err) {
        console.log(err)
        ctx.response.status = err.statusCode || err.status || 500;
        ctx.response.body = {
            message: err
        };
    }
});

app.use(async (ctx, next) => {
    await next().catch((err) => {
        if (401 === err.status) {
            ctx.status = 401;
            ctx.body = {
                status:401,
                msg:'登录过期，请重新登录'
            }
        } else {
            throw err;
        }
    });
});

app.use(koaBody({ multipart: true, jsonLimit: '2mb', formLimit: '100mb', textLimit: '1mb' }));

app.use(async(ctx, next)=> {
    const token = ctx.headers.authorization && ctx.headers.authorization.split(' ')[1];
    if(token === undefined){
        await next();
    }else{
        jwt.verify(token, SECRET,(err, data)=> {
            if (!err) {
                ctx.request.body = Object.assign(ctx.request.body, {updateBy: data.id});
            }
        })
        await next();
    }
})

app.use(koaJwt({ secret: SECRET}).unless({
    // 登录，注册接口不需要验证
    path: [/^\/api\/login/]
}));

app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(config.port);

server.setTimeout(config.timeout);

console.log(
    `服务已启动，请打开下面链接访问: \n http://127.0.0.1${
        config.port === '80' ? '' : ':' + config.port
    }/`
);