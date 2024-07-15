const mongoose = require("mongoose");
const schema = mongoose.Schema;

const appschema = new schema({
    name : {
        type : String ,
        required : true
    },
    eduaction : {
        type : String ,
         required : true
    },
    email : {
        type : String ,
        required : true
    },
    status : {
        type : Boolean,
        default : false
    },
    appliedto : {
        type :mongoose.Schema.Types.ObjectId,
        ref : 'Job'
    },
    resume : String,
    about : String ,
    skills : String
})

module.exports = mongoose.model('Applicant' , appschema)