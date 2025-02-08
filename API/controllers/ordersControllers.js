const {
    orderSchema,
    orderEditSchema,
    orderItemsSchema,
  } = require("../validators/validators");
  
  //GET ALL ORDERS
  function getOrders(req, res) {
    let pool = req.pool;
    pool.query(`select * from orders`, (err, result) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: "Internal server error.",
        });
        console.log("Error occured in query", err);
      } else {
        res.json({ orders: result.recordset });
      }
    });
  }
  
  //PLACE AN ORDER
  function placeAnOrder(req, res) {
    let pool = req.pool;
    let placedOrder = req.body;
    //validation
    const { error, value } = orderSchema.validate(placedOrder, {
      abortEarly: false,
    });
    if (error) {
      console.log(error);
      res.json(error.details);
      return;
    }
  
    pool.query(
      `INSERT INTO orders (waiter_id, table_number, order_status)
  VALUES ('${value.waiter_id}', '${value.table_number}', '${value.order_status}')`,
      (err, result) => {
        if (err) {
          console.error("Error inserting new meal:", err);
        } else {
          res.status(201).json({
            message: "Order placed successfully",
            placedOrder,
          });
        }
      }
    );
  }
  
  //DELETE AN ORDER
  function deleteAnOrder(req, res) {
    let pool = req.pool;
    let orderToDelete = req.params.orderId;
    pool.query(
      `DELETE FROM orders WHERE order_id = ${orderToDelete}`,
      (err, result) => {
        //ERROR CHECK
        if (err) {
          res.status(500).json({
            success: false,
            message: "Internal server error.",
          });
          console.log("Error occured in query", err);
        }
  
        //CHECK IF REQUESTED USER IS AVAILABLE
        if (result.rowsAffected[0] === 0) {
          res.json({
            success: false,
            message: "Order not found!",
          });
          return;
        }
  
        //RESPONSE
        res.json({
          success: true,
          message: "Order deleted successfully!",
          result: result.rowsAffected,
        });
      }
    );
  }
  
  //EDIT AN ORDER
  function updateAnOrder(req, res) {
    let pool = req.pool;
    let orderToEdit = req.params.orderId;
    let orderEditDetails = req.body;
  
    //validation
    const { error, value } = orderEditSchema.validate(orderEditDetails, {
      abortEarly: false,
    });
    if (error) {
      console.log(error);
      res.send(error.details.message);
      return;
    }
  
    pool.query(
      `UPDATE orders
        SET order_status = '${value.order_status}' WHERE order_id = '${orderToEdit}'`,
      (err, result) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: "Internal server error.",
          });
          console.log("Error occured in query", err);
        }
        // Check if any rows were affected
        if (result.rowsAffected[0] === 0) {
          return res.status(404).json({
            success: false,
            message: `Order with ID ${orderToEdit} not found.`,
          });
        } else {
          res.json({
            success: true,
            message: "Order status updated successfully.",
            orderStatus: orderEditDetails,
          });
        }
      }
    );
  }
  
  //SELECT ORDER ITEMS
  function getOrderItems(req, res) {
    let pool = req.pool;
    pool.query(
      `SELECT 
      oi.order_items_id, 
      oi.order_id, 
      oi.meal_id, 
      mi.name AS meal_name,
      oi.quantity
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
          res.json({ orderItems: result.recordset });
        }
      }
    );
  }
  
  //SELECT ORDER ITEMS
  function selectOrderItems(req, res) {
    let pool = req.pool;
    let addedItem = req.body;
    // Validation
    const { error, value } = orderItemsSchema.validate(addedItem, {
      abortEarly: false,
    });
    if (error) {
      console.log(error);
      return res.status(400).json({ errors: error.details });
    }
  
    pool.query(
      `insert into order_items (order_id, meal_id, quantity)
  VALUES ('${value.order_id}', '${value.meal_id}', '${value.quantity}')`,
      (err, result) => {
        if (err) {
          console.error("Error inserting new meal:", err);
        } else {
          res.status(201).json({
            message: "Items added successfully",
            addedItem,
          });
        }
      }
    );
  }
  
  //EDIT ORDER ITEMS
  function editOrderItems(req, res) {
    let pool = req.pool;
    let itemToEdit = req.params.itemId;
    let edits = req.body;
    pool.query(
      `UPDATE order_items
        SET quantity = '${edits.quantity}' WHERE order_id = '${itemToEdit}'`,
      (err, result) => {
        if (err) {
          res.status(500).json({
            success: false,
            message: "Internal server error.",
          });
          console.log("Error occured in query", err);
        }
        // Check if any rows were affected
        if (result.rowsAffected[0] === 0) {
          return res.status(404).json({
            success: false,
            message: `Order item with ID ${itemToEdit} not found.`,
          });
        } else {
          res.json({
            success: true,
            message: "Order item updated successfully.",
            quantity: edits,
          });
        }
      }
    );
  }
  
  //DELETE ORDER ITEM
  function deleteOrderItem(req, res) {
    let pool = req.pool;
    let itemToDelete = req.params.itemId;
    pool.query(
      `DELETE FROM order_items WHERE order_items_id = ${itemToDelete}`,
      (err, result) => {
        //ERROR CHECK
        if (err) {
          res.status(500).json({
            success: false,
            message: "Internal server error.",
          });
          console.log("Error occured in query", err);
        }
  
        //CHECK IF REQUESTED USER IS AVAILABLE
        if (result.rowsAffected[0] === 0) {
          res.json({
            success: false,
            message: "Item not found!",
          });
          return;
        }
  
        //RESPONSE
        res.json({
          success: true,
          message: "Item deleted successfully!",
        });
      }
    );
  }
  
  module.exports = {
    getOrders,
    placeAnOrder,
    deleteAnOrder,
    updateAnOrder,
    getOrderItems,
    selectOrderItems,
    editOrderItems,
    deleteOrderItem,
  };
  