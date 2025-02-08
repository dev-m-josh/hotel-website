const authRouter = require("express").Router();

const { userLogin } = require('../controllers/usersControllers')

authRouter.post('/login', userLogin);

module.exports = { authRouter }