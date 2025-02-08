const express = require("express");
const cors = require('cors');
const sql  =require("mssql");
const { authRouter } = require('./routers/auth_routers');
const { mealsRouter } = require('./routers/mealsRouters');
const { usersRouter } = require("./routers/usersRouters");
const { salesRouter } = require('./routers/salesRouters');
const { freeRouter } = require("./routers/routers");
const { ordersRouter } = require("./routers/ordersRouters");
const { verifyToken, errorHandler, routesErrorHandler } = require('./middleWares/middleware');
require("dotenv").config();
const {config} = require("./config/db_config");


async function startServer() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));

    try {
        //CONNECT TO DATABASE
        let pool = new sql.ConnectionPool(config);
        await pool.connect()
        if (pool.connected) {
            console.log("Database connected successfully")
        }
        app.use(function(req, res, next){
            req.pool = pool;
            next()
        })

        app.use(freeRouter)
        app.use(authRouter);
        app.use(verifyToken);
        app.use("/meals",mealsRouter);
        app.use("/users", usersRouter);
        app.use("/orders", ordersRouter)
        app.use("/sales",salesRouter);
        app.all('*', routesErrorHandler );
        app.use(errorHandler);


        const port = 3500;
        app.listen(port, ()=>{
        console.log(`Sever listening to port: ${port}`)
        });

    } catch (error) {
        console.log(error)
    }

}

startServer()