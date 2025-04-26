const express = require('express');
const router = express.Router();
const MenuItem = require('./../models/MenuItem');

//post method to create menu
router.post('/', async(req,res)=>{
    try{
        const menuData = req.body;
         
        // new document 
        const newMenuData = new MenuItem(menuData);
        
        //save document
        const dataMenu = await newMenuData.save();
        res.status(200).json(dataMenu);
        console.log(dataMenu, 'Menu Data saved succcessfully!',);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Sever Error'});
    }
});

//get method to read menu
router.get('/', async(req,res)=>{
    try{
        const menuData = await MenuItem.find();
        res.status(200).json(menuData);
        console.log('Menu Data fetched successfully');
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

//parameterized endpoints
//get method to read menu based on taste
router.get('/:taste', async(req,res)=>{
    try{

        const taste = req.params.taste // extract the taste from the url parameter
        if(taste == 'Spicy' || taste == 'Sweet' || taste == 'Sour'){
            const response = await MenuItem.find({ taste: taste});
            console.log('Menu data fetched successfully!');
            res.status(200).json(response);
        }else{
            res.status(404).json('Invalid taste type');
            console.log('Invalid taste type');
        }
    }   
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.put('/:id', async(req,res)=>{
    try{
        const menuId = req.params.id;
        const menuUpdatedData = req.body;
        const response = await MenuItem.findByIdAndUpdate(menuId, menuUpdatedData, {
            new: true,
            runValidators: true
        });
        if(!response){
            res.status(404).json({error: 'Invalid Menu Id'});
        }
        console.log(response, 'Menu data updated successfully!');
        res.status(200).json(response, {Status: 'Menu data updated successfully!'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.delete('/:id', async(req,res)=>{
    try{
        const menuId = req.params.id;
        const response = await MenuItem.findByIdAndDelete(menuId);
        if(!response){
            res.status(404).json({error: 'Invalid Menu Id'});
        }
        console.log(response, 'Menu data deleted successfully!');
        res.status(200).json({message : 'Menu data deleted successfully!'});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})
module.exports = router;