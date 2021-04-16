import UserController from './controllers/user.controller';
import FileController from "./controllers/file.controller";
import BridgeController from "./controllers/bridge.controller";
const Router = require('koa-router')
const router = new Router({
    prefix: '/api', // 统一前缀，接口全部为 /api/xxx 格式
})
const userController = new UserController()
const fileController = new FileController();
const bridgeController = new BridgeController();

router.post('/login', userController.login);

router.post('/file/create', fileController.create);
router.post('/file/list', fileController.list);
router.post('/file/upload', fileController.upload, fileController.writeFile);
router.post('/file/edit', fileController.edit);
router.post('/file/delete', fileController.delete);

router.post('/user/create', userController.create);
router.post('/user/list', userController.list);
router.post('/user/edit', userController.edit);
router.post('/user/delete', userController.delete);

router.post('/bridge/create', bridgeController.create);
router.post('/bridge/list', bridgeController.list);
router.post('/bridge/edit', bridgeController.edit);
router.post('/bridge/delete', bridgeController.delete);
router.post('/bridge/exec', bridgeController.exec)

module.exports = router;
