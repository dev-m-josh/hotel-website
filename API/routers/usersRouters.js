const usersRouter = require("express").Router();
const { editUser, deleteUser, getAllStaffs } = require('../controllers/usersControllers')

usersRouter.get('/', getAllStaffs);
usersRouter.put('/:userId', editUser);
usersRouter.delete('/:userId', deleteUser);
module.exports = { usersRouter }