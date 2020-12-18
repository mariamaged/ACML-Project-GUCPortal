const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const router = express.Router();
const AcademicStaff = require('../Models/AcademicStaffModel.js');
const HR = require('../Models/HRModel.js');
const StaffMemberModel = require('../Models/StaffMemberModel.js');


router.post('/login',async(req,res,next)=>{
    console.log("here in login")
    try{
        const{email,password}=req.body;
        if(!email ){
            return res.status(400).json("Please enter valid email ");
        }
        if(!password)
        return res.status(400).json("Please enter valid  password");

        const existingUser=await StaffMemberModel.findOne({email:email})
        if(!existingUser){
            return res.status(400).json({msg:"This user is not registered"});
        }
        else{
            //user first login original pass='123456'
            if(existingUser.newStaffMember===true)
                res.json("Please enter new Password")
            
            const isMatched=await bcrypt.compare(password,existingUser.password);       //comparing password entered text with password of the user we got from the database            
            if(isMatched===false){
                 return res.status(400).json({msg:"Please enter correct password"});
             }

             else if(existingUser.staff_type=="HR"){
                const token=jwt.sign({id:existingUser._id,role:existingUser.staff_type},process.env.TOKEN_SECRET);
                res.header('auth-token', token).send(token);
             return   res.json({token,existingUser});
            }
            else{
                const user=AcademicStaff.findById(existingUser._id);
                const token=jwt.sign({id:existingUser._id,role:user.type,isHead:user.isHOD,isCoordinator:user.isCoordinator},process.env.TOKEN_SECRET);
                res.header('auth-token', token).send(token);
             return   res.json({token});
            }

         }
        
    }
        catch(err){
          return  res.status(500).json({error:err.message});
        }
    
})

//user first login shoudl change password hash it and update his account
router.post('/enterNewPass',authenticateToken,async(req,res)=>{

    
    const passNew=req.body.newPassword;
    const passCheck=req.body.passCheck;
    const user=await StaffMemberModel.findById(req.user.id)
    if(passNew!=passCheck){
        return res.status(400).json({msg:"Passwords should match"});
    }
    else{
        console.log("in else")
        console.log(req.user.id)
        const salt=await bcrypt.genSalt();             //in case password is weak
        const hashedPassword=await bcrypt.hash(passNew,salt);
        console.log("hashed pass= "+hashedPassword)
        try{
      await  StaffMemberModel.findByIdAndUpdate(req.user.id,{password:hashedPassword,newStaffMember:false})
      return  res.json( await StaffMemberModel.findById(req.user.id))
        }
        catch(err){
           return res.json(err)
        }
      
    }

   
        
})

function authenticateToken(req,res,next){
    const token=req.header('x-auth-token');
    if(!token){
    return res.sendStatus(401).status('Access deined')
    
    }
    const verified= jwt.verify(token, process.env.TOKEN_SECRET)
    req.user=verified
   
    next();
}

module.exports=router;