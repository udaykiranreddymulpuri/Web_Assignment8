const mongoose=require('mongoose');
const b = require('bcrypt');

const uSchema= new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        validate: {
            validator: validate => {
                const reg = /^[A-Za-z]{4,15}$/i;
                return validate.match(reg)
            },
            message : out => `The username should have 4 to 15 alphabets only!!`
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate: {
            validator: validate => {
                const reg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                return validate.match(reg)
            },
            message : out => `The mailid ${out.value} is not valid!`
        }

    },
    password:{
        type:String,
        required:true,
        validate: {
            validator : validate => {
                const reg =  /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{10,16}$/;
                return validate.match(reg);
            },
            message: out => `Password must contain a special character,number, one capital letter!`
        }
    }

});

uSchema.pre('save', async function(next){
    try{
        this.password = await b.hash(this.password,await b.genSalt(10));
        next();
    }catch(err){
        next(err);
    }
});
module.exports = mongoose.model('User_Collection', uSchema);


