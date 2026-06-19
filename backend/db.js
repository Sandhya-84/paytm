const mongoose=require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log(err);
    });


const userSchema=new mongoose.Schema({
    username:{
        type: String,
        required:true,
        unique:true,
        minLength:3,
        maxLength:20,
        trim:true
    },
    password: {
        type: String,
        required:true,
        minLength:8,
    },
    firstName: {
        type: String,
        required:true,
        maxLength:30,
        trim:true

    },
    lastName: {
        type: String,
        required:true,
        maxLength:30,
        trim:true
    }
});

const User=mongoose.model("User",userSchema);

const accountSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    balance:{
        type: Number,
        required: true,
        default:0
    }
});
const Account=mongoose.model("Account",accountSchema);

const transactionSchema=new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
     senderFirstName: String,
    senderLastName: String,
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
     receiverFirstName: String,
    receiverLastName: String,

    amount: Number,
    createdAt:{
        type: Date,
        default : Date.now
    }
});

const Transaction=mongoose.model("Transaction",transactionSchema);

module.exports={
    User,
    Account,
    Transaction
};