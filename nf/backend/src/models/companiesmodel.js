import mongoose from "mongoose";

const company = new mongoose.Schema ({
    name:{
        type: String,
        unique:true,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    description: {
        type: String,   
        required: true
    },
    jobRole: {
        type: String,
        required: true
    },
    criteria: {
        type: Number,// gpa
        required: true 
    },
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

const Company = mongoose.model("Company",company);

export default Company;