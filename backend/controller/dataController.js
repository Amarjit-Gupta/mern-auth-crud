import Data from "../config/datadb.js";
import fs from 'fs';
import path from "path";

export const addData = async (req, res) => {
    try {
        const { name, price, company, category } = req.body;
        const file = req.file.filename;
        // console.log(name, price, company, category, file);
        if (!name || !price || !company || !category || !file) {
            return res.status(400).json({ success: false, message: "Please provide name, price, company, category and file..." });
        }
        else {
            let result = new Data({ name, price, company, category, file });
            let data = await result.save();
            return res.status(200).json({ success: true, data, message: "all Data inserted..." });
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: "something went wrong..." });
    }
}

export const getData = async (req, res) => {
    try {
        const price = req.query.price;
        const sorted = {};
        if(price=="asc"){
            sorted.price=1;
        }
        if(price=="desc"){
            sorted.price=-1;
        }
        let data = await Data.find({}).sort(sorted);
        return res.status(200).json({ success: true, data, message: "all Data..." });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "something went wrong..." });
    }
}

export const getSingleData = async (req, res) => {
    try {
        const id = req.params.id;
        let data = await Data.findOne({ _id: id });
        return res.status(200).json({ success: true, data, message: "single Data..." });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "something went wrong..." });
    }
}

const dirPath = path.join(import.meta.dirname, "../uploads");

export const updateSingleData = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, price, company, category } = req.body;
        let newFile = "";
        if (req.file) {
            newFile = req.file.filename;
            try{
                fs.unlinkSync(`${dirPath}/${req.body.oldFile}`);
            }
            catch(err){
                console.log("something went wrong...");
            }
        }
        else {
            newFile = req.body.oldFile;
        }
        let result = await Data.updateOne({ _id: id }, { $set: { name, price, company, category, file: newFile } });
        return res.status(200).json({ success: true, result, message: "update Data..." });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "something went wrong..." });
    }
}

export const deleteSingleData = async (req, res) => {
    try {
        const id = req.params.id;
        let result = await Data.findByIdAndDelete(id);
        try{
            fs.unlinkSync(`${dirPath}/${result.file}`);
        }
        catch(err){
            console.log("something went wrong...");
        }
        return res.status(200).json({ success: true, result, message: "Data deleted..." });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "something went wrong..." });
    }
}

export const search = async (req, res) => {
    try {
        const query = req.params.key;
        let result = await Data.find({
            $or:[
                {name:{$regex:query,$options:"i"}},
                {company:{$regex:query,$options:"i"}},
                {category:{$regex:query,$options:"i"}}
            ]
        });
        return res.status(200).json({ success: true,result, message: "Data deleted..." });
    }
    catch (err) {
        res.status(500).json({ success: false, message: "something went wrong..." });
    }
}