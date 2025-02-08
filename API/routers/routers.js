const freeRouter = require("express").Router();
const { getAllMeals } = require('../controllers/mealsControllers');
const { addNewUser} = require('../controllers/usersControllers');

freeRouter.get('/meals', getAllMeals);
freeRouter.post('/users', addNewUser);

module.exports = { freeRouter }