import mongoose from "mongoose";

if (!mongoose.connection.readyState) {
    mongoose.connect(process.env.DATABASE_URI).then(() => {
        console.log("data's database connected..");
    }).catch((err) => {
        console.log("data's database connection failed...");
    });
}

const userSchema = new mongoose.Schema({
    name: { type: String },
    price: { type: Number },
    company: { type: String },
    category: { type: String },
    file: { type: String },
}, { timestamps: true });

const Data = mongoose.models.MernData || mongoose.model("MernData", userSchema);
export default Data;