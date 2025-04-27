const express = require('express');
const router = express.Router();
const Person = require('./../models/Person');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

//post method to create person
router.post('/signup', async(req,res)=>{
    try{
        const data = req.body; //assuming the request body contains the person data
    
        //create the new person document using the mongoose model
        const newPerson = new Person(data);

        //save the newPerson data to the database
        const response = await newPerson.save();
        console.log("User data saved successfully!");

        const payload = {
            id: response.id,
            username: response.username
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log('Token is : ', token);

        res.status(200).json({response: response, token: token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error : 'Internal Server Error'});
    }

});

//post method to login to existing user
router.post('/login', async(req,res)=>{
    try{
        //extract username and password from body
        const {username, password} = req.body;

        //find user by username
        const user = await Person.findOne({username: username});
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }
        //generate token
        const payload = {
            id: user.id,
            username: user.username
        }
        const token = generateToken(payload);
        res.status(200).json({token});
        console.log(user);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'})
    }
});

//profile route
router.get('/profile', jwtAuthMiddleware, async(req,res)=>{
    try{
        const userData = req.user;
        console.log('User data: ', userData);
        const id = userData.id;
        const user = await Person.findById(id);
        res.status(200).json({user});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

//get method to get all the person details
router.get('/', jwtAuthMiddleware, async(req,res)=> {
    try{
        const allPersonData = await Person.find()
        res.status(200).json(allPersonData);
        console.log(' User data fetched successfully!');
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

// paramterized endpoints
//get method to read person's work type
router.get('/:workType', async(req,res)=>{
    try{
        const workType = req.params.workType; // extract the work type from the URL parameter
        if(workType == 'chef' || workType == 'waiter' || workType == 'manager'){
            const response = await Person.find({ work: workType });
            console.log('User data fetched successfully');
            res.status(200).json(response);
        }else{
            console.log('Invalid work type');
            res.status(404).json('Invalid work type');
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.put('/:id', async(req, res)=>{
    try{
        const personId = req.params.id;
        const personUpdatedData = req.body;
        const response = await Person.findByIdAndUpdate(personId, personUpdatedData, {
            new: true, //return the updated document
            runValidators: true //run mongoose validation
        });
        if(!response){
            res.status(404).json({error: 'Person not found'})
        }
        console.log(response, 'User data updated successfully!');
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.delete('/:id', async(req,res)=>{
    try{
        const personId = req.params.id;
        const response = await Person.findByIdAndDelete(personId);
        if(!response){
            res.status(404).json('Person not found');
        }
        console.log(response, 'User data deleted successfully!');
        res.status(200).json({message: 'Person data deleted successfully!'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

module.exports = router;
