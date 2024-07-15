const mongoose = require("mongoose");
const schema = mongoose.Schema;
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/jobboarddb");

const userSchema = new schema({
    username : String,
    email :{
        type : String ,
    },
    password : {
        type : String
    },
    role : {
        type : String ,
        enum : ['employer' , 'candidate'],
        default : 'candidate'
    },
    jobs : [{
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'Job'
    }],
    appliedto : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Applicant'
    }]
});

userSchema.plugin(plm);

module.exports = mongoose.model('User' , userSchema);
