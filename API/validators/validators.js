const joi = require('joi');
//NEW MEAL
const newMealSchema = joi.object({
    name: joi.string().required(),
    category: joi.string().required(),
    description: joi.string().required(),
    price: joi.number().required()
})


 //CREATING A NEW USER
 const newUserSchema = joi.object({
    username: joi.string().required(),
    user_email: joi.string().email().required(),
    user_password: joi.string().min(8).max(64).required(),
    user_role: joi.string().required()
});

//USER LOGIN SCHEMA
const userLoginSchema = joi.object({
    user_email: joi.string().email().required(),
    user_password: joi.string().min(8).max(64).required(),
    user_role: joi.string().required()
});

//AVAILABLE SERVINGS SCHEMA
const availableServingsSchema = joi.object({
    meal_id: joi.number().required(),
    available_servings: joi.number().required()
});

//ORDER ITEMS SCHEMA
const orderItemsSchema = joi.object({
    order_id: joi.number().required(),
    meal_id: joi.number().required(),
    quantity: joi.number().required()
});

//ORDER SCHEMA
const orderSchema = joi.object({
    waiter_id: joi.number().required(),
    order_status: joi.string().required(),
    table_number: joi.number().required()
});

//ORDER EDIT SCHEMA
const orderEditSchema = joi.object({
    order_status: joi.string().required()
});

module.exports = { newMealSchema, newUserSchema, userLoginSchema, availableServingsSchema, orderItemsSchema, orderSchema, orderEditSchema }