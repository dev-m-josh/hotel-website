const {
    newMealSchema,
    availableServingsSchema,
  } = require("../validators/validators");
  //GET ALL MEALS
  function getAllMeals(req, res) {
    let pool = req.pool;
    let { page, pageSize } = req.query;
    let offset = (Number(page) - 1) * Number(pageSize);
    pool.query(
      `SELECT * FROM menu_items ORDER BY meal_id OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
      (err, result) => {
        if (err) {
          console.log("error occured in query", err);
        } else {
          res.json({ meals: result.recordset });
        }
      }
    );
  }
  
  //DELETE MEAL
  function deleteMeal(req, res) {
    let pool = req.pool;
    let requestedId = req.params.mealId;
    pool.query(
      `DELETE FROM menu_items WHERE meal_id = ${requestedId}`,
      (err, result) => {
        //ERROR CHECK
        if (err) {
          res.status(500).json({
            success: false,
            message: "Internal server error.",
          });
          console.log("Error occured in query", err);
        }
  
        //CHECK IF REQUESTED MEAL IS AVAILABLE
        if (!result.rowsAffected) {
          res.json({
            success: false,
            message: "Meal not found!",
          });
          return;
        }
  
        //RESPONSE
        res.json({
          success: true,
          message: "Meal deleted successfully!",
          result: result.rowsAffected,
        });
      }
    );
  }
  
  // ADD NEW MEAL
  function addNewMeal(req, res) {
    const pool = req.pool;
    const newMeal = req.body;
  
    // Validation
    const { error, value } = newMealSchema.validate(newMeal, {
      abortEarly: false,
    });
    if (error) {
      console.log(error);
      return res.status(400).json({ errors: error.details });
    }
  
    // Insert the new meal into the database
    pool.query(
      `INSERT INTO menu_items (name, category, description, price) 
      VALUES ('${value.name}', '${value.category}', '${value.description}', '${value.price}')`,
      (err, result) => {
        if (err) {
          console.error("Error inserting new meal:", err);
        } else {
          res.status(201).json({
            message: "Meal added successfully",
            newMeal,
          });
        }
      }
    );
  }
  
  //EDIT A MEAL
  function editMeal(req, res) {
    let pool = req.pool;
    let requestedMealId = req.params.mealId;
    let mealEdits = req.body;
    pool.query(
      `UPDATE menu_items
        SET name = '${mealEdits.name}', category = '${mealEdits.category}', description = '${mealEdits.description}', price = '${mealEdits.price}' WHERE meal_id = '${requestedMealId}'`,
      (err, result) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: "Internal server error.",
          });
          console.log("Error occured in query", err);
        }
        // Check if any rows were affected
        if (!result.rowsAffected) {
          return res.status(404).json({
            success: false,
            message: `Meal with ID ${userToEditId} not found.`,
          });
        } else {
          res.json({
            success: true,
            message: "Edit was successfully done.",
            rowsAffected: result.rowsAffected,
            newUserDetails: mealEdits,
          });
        }
      }
    );
  }
  
  //MOST TRENDING MEALS
  function getTrendingMeals(req, res) {
    let pool = req.pool;
    let { page, pageSize } = req.query;
    let offset = (Number(page) - 1) * Number(pageSize);
    pool.query(
      `SELECT 
      mi.name AS meal_name,
      SUM(oi.quantity) AS total_orders
  FROM 
      order_items oi
  JOIN 
      orders o ON oi.order_id = o.order_id
  JOIN 
      menu_items mi ON oi.meal_id = mi.meal_id
  WHERE 
      o.created_at >= DATEADD(WEEK, -1, GETDATE())
  GROUP BY 
      mi.name
  ORDER BY 
      total_orders DESC OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
      (err, result) => {
        if (err) {
          console.log("error occured in query", err);
        } else {
          res.json({trendingMeals:result.recordset});
        }
      }
    );
  }
  
  //tracking servings available on a particular day
  function getAvailableServings(req, res) {
    let pool = req.pool;
    let { page, pageSize } = req.query;
    let offset = (Number(page) - 1) * Number(pageSize);
  
    pool.query(
      `SELECT 
      mi.meal_id,                               
      mi.name AS meal_name,                     
      ash.available_servings - COALESCE(SUM(oi.quantity), 0) AS available_servings,  
      ash.day                                    
  FROM 
      menu_items mi
  JOIN 
      available_servings ash 
      ON mi.meal_id = ash.meal_id
  LEFT JOIN 
      order_items oi 
      ON mi.meal_id = oi.meal_id
      AND oi.order_id IN (SELECT order_id FROM orders WHERE order_status = 'Served')  
  WHERE 
      ash.day = (SELECT MAX(day) FROM available_servings WHERE meal_id = mi.meal_id)  
  GROUP BY 
      mi.meal_id, mi.name, ash.available_servings, ash.day  
  ORDER BY 
      mi.name OFFSET ${offset} ROWS FETCH NEXT ${pageSize} ROWS ONLY`,
      (err, result) => {
        if (err) {
          console.log("error occured in query", err);
        } else {
          res.json({ availableServings: result.recordset });
        }
      }
    );
  }
  
  //ADD SERVINGS AVAILABLE
  function addAvailableServings(req, res) {
    let pool = req.pool;
    let servings = req.body;
  
    //validate
    const { error, value } = availableServingsSchema.validate(servings, {
      abortEarly: false,
    });
    if (error) {
      console.log(error);
      return res.status(400).json({ errors: error.details });
    }
  
    pool.query(
      `INSERT INTO available_servings ( meal_id, available_servings)
      VALUES ('${value.meal_id}', '${value.available_servings}')`,
      (err, result) => {
        //ERROR AND RESPONSE
        if (err) {
          res.status(500).json({
            success: false,
            message: "Internal server error.",
          });
          console.log("Error occured in query", err);
        } else {
          res.json({
            success: true,
            message: "available_servings set successfully",
            servings,
          });
        }
      }
    );
  }
  
  //DELETE AVAILABLE SERVINGS
  function deleteAvailableServings(req, res) {
    let pool = req.pool;
    let requestedId = req.params.servingsId;
    pool.query(
      `DELETE FROM available_servings WHERE meal_id = ${requestedId}`,
      (err, result) => {
        //ERROR CHECK
        if (err) {
          res.status(500).json({
            success: false,
            message: "Internal server error.",
          });
          console.log("Error occured in query", err);
        }
  
        //CHECK IF REQUESTED MEAL IS AVAILABLE
        if (!result.rowsAffected) {
          res.json({
            success: false,
            message: "No available servings",
          });
          return;
        }
  
        //RESPONSE
        res.json({
          success: true,
          message: "Servings deleted successfully!",
          result: result.rowsAffected,
        });
      }
    );
  }
  
  module.exports = {
    addNewMeal,
    deleteMeal,
    getAllMeals,
    getTrendingMeals,
    getAvailableServings,
    addAvailableServings,
    deleteAvailableServings,
    editMeal,
  };
  