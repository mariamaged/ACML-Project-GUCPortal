const express=require('express')
const router=express.Router();
const AcademicStaff=require('../Models/AcademicStaffModel.js')
const StaffMember=require('../Models/StaffMemberModel.js')
const HR=require('../Models/HRModel.js')
const StaffMemberModel = require('../Models/StaffMemberModel.js')
const location= require('../Models/LocationModel.js')


const jwt=require('jsonwebtoken');


//Locations Adding,deleting, and updating
//adding
router.route('/Location').post(async(req,res)=>{
    //to authorize
    //if(req.user.role!='HR')
      // res.status(401).send('Access Denied');
    try{
        //yedakhaly max_capacity wla ahotaha ana based 3la el type?
        const{id,type,maximum_capacity}=req.body;
        if(!id || !type || !maximum_capacity)
           return res.status(400).json({msg:"Please enter a correct location"});
        else{
           toAdd= new location({id,type,maximum_capacity,current_capacity:0});
           await toAdd.save();
           res.json(toAdd);
           console.log(toAdd);   
        }
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
})

//deleting
.delete(async (req,res)=>{
   try{
    const{id}=req.body;
   if(!id) res.status(400).json({msg:"please enter the id of the location to be deleted"});
   else{ 
    await location.deleteOne({"id":id});
    res.send("done");
    }
}catch(err){
    res.status(500).json({error:err.message});
}
})

//updating 
.put(async(req,res)=>{
    try{
        const{oldid,id,type,maximum_capacity}=req.body;
        if(!oldid||!id||!type||!maximum_capacity) res.status(400).json({msg:"please fill all the fields for the location to be updated successfully"});
        else{
            const Obid= await location.findOne({"id":oldid});
            Obid.type=type;
            Obid.id=id;
            Obid.maximum_capacity=maximum_capacity;
            await Obid.save();
            res.send("done");  

        }
    }catch(err){
        res.status(500).json({error:err.message});
    }
})

module.exports=router;