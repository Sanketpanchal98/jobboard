let mongoose = require("mongoose");
let schema = mongoose.Schema

let jobSchema = new schema({
    title : {
        type :String ,
        required : true
    }, 
    description :{
        type :String ,
        required : true
    }, 
    eligibility :{
        type :String ,
        required : true
    }, 
    expiry : {
        type : Boolean , 
        default : false
    },
    employerid : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'User'
    } ,
    createdAt : {
        type : Date ,
        default : Date.now 
    },
    appliedby : [{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Applicant'
    }]
});

module.exports = mongoose.model("Job" , jobSchema);