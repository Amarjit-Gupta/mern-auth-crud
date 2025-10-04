import express from 'express';
import multer from 'multer';
import { addData, deleteSingleData, getData, getSingleData, search, updateSingleData } from '../controller/dataController.js';

const dataRoute = express.Router();

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        return cb(null,"./uploads");
    },
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({storage:storage});

dataRoute.post("/addData",upload.single("file"),addData);
dataRoute.get("/getData",getData);
dataRoute.get("/getSingleData/:id",getSingleData);
dataRoute.put("/updateSingleData/:id",upload.single("file"),updateSingleData);
dataRoute.delete("/deleteSingleData/:id",deleteSingleData);
dataRoute.get("/search/:key",search);

export default dataRoute;


