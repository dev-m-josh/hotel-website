const mealsRouter = require("express").Router();

const {
  addNewMeal,
  deleteMeal,
  getTrendingMeals,
  getAvailableServings,
  addAvailableServings,
  deleteAvailableServings,
  editMeal,
} = require("../controllers/mealsControllers");

mealsRouter.post("/", addNewMeal);
mealsRouter.delete("/:mealId", deleteMeal);
mealsRouter.put("/:mealId", editMeal);
mealsRouter.get("/available-servings", getAvailableServings);
mealsRouter.get("/trending-meal", getTrendingMeals);
mealsRouter.post("/available-servings", addAvailableServings);
mealsRouter.delete("/available-servings/:servingsId", deleteAvailableServings);

module.exports = { mealsRouter };
