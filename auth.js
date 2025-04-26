const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Person = require('./models/Person');

passport.use(new LocalStrategy(async (USERNAME, password, done)=>{
    // authentication logic here
    try{
        // console.log('Received Credentials: ', USERNAME, password);
        const user = await Person.findOne({username: USERNAME});
        if(!user){
            return done(null, false, {message: 'Invalid username'});
        }
        const isPasswordMatch = await user.comparePassword(password);
        // const isPasswordMatch = user.password === password ? true : false; (this will use with bcrypt)
        if(isPasswordMatch){
            return done(null, user);
        }else{
            return done(null, false, {message: 'Incorrect password'});
        }
    }
    catch(err){
        console.log(err);
        return done(err);
    }
}));


module.exports = passport;