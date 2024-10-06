import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./database/db.js";
import { errorHandler } from "./middleware/error.js";
import entryRouters from "../backend/routers/entryRoutes.js";



const app = express();


//dotenv access
dotenv.config(
   {
    path: "./.env"  
   }
);




//middleware
app.use(express.json());
app.use(cors(
    {origin:"http://localhost:3000",optionsSuccessStatus: 200}
));


//Router 
app.use("/api/v1",entryRouters);






//databse connection
dbConnection();
app.use(errorHandler);






const PORT = process.env.PORT || 5000;





app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
})