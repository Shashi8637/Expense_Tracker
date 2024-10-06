import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
    amount:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    subcategory:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        enum:['Income','Expense'],
        required:true,
    },
    paymentMethod:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        required: true,
    },
    description:{
        type:String
    }
});


export const Entry = mongoose.model("Entry",entrySchema);