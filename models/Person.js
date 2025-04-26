const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// define person schema
const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age:{
        type: Number,
    },
    work: {
        type: String,
        enum: ['chef', 'manager', 'waiter'],
        required: true
    },
    mobile: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    }
});

personSchema.pre('save', async function(next){
    const person = this;

    //hash the password only if it is modified or have the new record.
    if(!person.isModified('password')) return next();

    try{
        //hash password generation
        //create random salt to add to password for hashing
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);
        
        // override the plain password with the hashed password
        person.password = hashedPassword;
        next();
    }
    catch(err){
        return next(err);
    }
});

personSchema.methods.comparePassword = async function(candidatePassword){
    try{
        // use bcrypt to compare the provided password with the hased password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }
    catch(err){
        throw err;
    }
};

//create person model
const Person = mongoose.model('Person', personSchema);
module.exports = Person;