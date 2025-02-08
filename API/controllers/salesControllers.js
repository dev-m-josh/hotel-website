//sales for each order
function salesForEachOrder(req, res) {
    let pool = req.pool;
    pool.query(
      `SELECT 
      oi.order_id,
      oi.meal_id,
      mi.name AS meal_name,
      oi.quantity,
      mi.price,
      (oi.quantity * mi.price) AS total_cost
  FROM 
      order_items oi
  JOIN 
      menu_items mi ON oi.meal_id = mi.meal_id`,
      (err, result) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: "Internal server error.",
          });
          console.log("Error occured in query", err);
        } else {
          res.json({ sales: result.recordset });
        }
      }
    );
  }
  
  //sales for today
  function salesForToday(req, res) {
    let pool = req.pool;
    pool.query(
      `SELECT 
      SUM(oi.quantity * mi.price) AS total_sales
  FROM 
      order_items oi
  JOIN 
      menu_items mi ON oi.meal_id = mi.meal_id
  JOIN
      orders o ON oi.order_id = o.order_id
  WHERE 
      o.created_at >= CAST(GETDATE() AS DATE)`,
      (err, result) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: "Internal server error.",
          });
          console.log("Error occured in query", err);
        } else {
          res.json({ sales: result.recordset });
        }
      }
    );
  }
  
  //sales for specific date range
  function salesForSpecificTimeRange(req, res) {
    let date = req.body;
    let pool = req.pool;
    pool.query(
      `SELECT 
      SUM(oi.quantity * mi.price) AS total_sales
  FROM 
      order_items oi
  JOIN 
      menu_items mi ON oi.meal_id = mi.meal_id
  JOIN 
      orders o ON oi.order_id = o.order_id
  WHERE 
      o.created_at >= '${date.start}'
      AND o.created_at < '${date.end}'`,
      (err, result) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: "Internal server error.",
          });
          console.log("Error occured in query", err);
        } else {
          res.json({ sales: result.recordset });
        }
      }
    );
  }
  
  module.exports = {
    salesForEachOrder,
    salesForToday,
    salesForSpecificTimeRange,
  };
  