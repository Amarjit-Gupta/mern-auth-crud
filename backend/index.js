import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import route from './route/authRoute.js';
import { deleteUnverifiedUser } from './deleteUnverifiedUser/deleteUser.js';
import dataRoute from './route/dataRoute.js';
import path from 'path';

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use(cors());

app.get("/hello",(req,res)=>{
    res.send("Hello");
});

deleteUnverifiedUser();


// for auth
app.use("/auth",route);

const dirPath1 = path.join(import.meta.dirname,"uploads");

// for data
app.use("/data",dataRoute);

app.use("/uploads",express.static(dirPath1));

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});
