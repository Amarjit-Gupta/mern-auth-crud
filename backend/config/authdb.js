import mongoose from "mongoose";

if(!mongoose.connection.readyState){
    mongoose.connect(process.env.DATABASE_URI).then(()=>{
        console.log("database connected..");
    }).catch((err)=>{
        console.log("database connection failed...");
    });
}

const userSchema = new mongoose.Schema({
    name:{type:String},
    email:{type:String,unique:true},
    password:{type:String},
    isAccountVerified:{type:Boolean,default:false},
    verifyEmailOtp:{type:String,default:""},
    verifyEmailOtpExpireAt:{type:Number,default:0},
    
    verifyOtp:{type:String,default:""},
    otpExpiredAt:{type:Number,default:0},
},{timestamps:true});

const User = mongoose.models.MernUser || mongoose.model("MernUser",userSchema);
export default User;