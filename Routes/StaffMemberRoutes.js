const express = require('express');
const router = express.Router();
const AcademicStaff = require('../Models/AcademicStaffModel.js');
const StaffMember = require('../Models/StaffMemberModel.js');
const HR = require('../Models/HRModel.js');
const StaffMemberModel = require('../Models/StaffMemberModel.js');

//for first time login will save email
let emailFirst="";
let currentUser;
let currentUserID;


//router.use(express.json())
router.post('/login',async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email || !password){
            return res.status(400).json("Please enter valid email and password");
        }
        const existingUser=await StaffMembers.findOne({email:email})
        currentUser=existingUser
         currentUserID=existingUser._id
        if(!existingUser){
            return res.status(400).json({msg:"You are not registered"});
        }
        else{
            //user first login original pass='123456'
            if(existingUser.newStaffMember)
                emailFirst=existingUser.email
               res.redirect('/enterNewPass');
              //  next('route')

            const isMatched=await bcrypt.compare(password,existingUser.password);       //comparing password entered text with password of the user we got from the database
             if(!isMatched){
                 return res.status(400).json({msg:"Please enter correct password"});
             }

             else if(existingUser.staff_type=="HR"){
                const jwt_password="Gw%E~gcpf^BFc3b[";
                const token=jwt.sign({id:existingUser._id,role:existingUser.staff_type},jwt_password);
                res.json({token,existingUser});
            }
            else{
                const user=AcademicStaff.findById(existingUser._id);
                // const role=user.type
                // const isHead=user.isHOD
                // const isCoordinator=user.isCoordinator
                
                const jwt_password="Gw%E~gcpf^BFc3b[";
                const token=jwt.sign({id:existingUser._id,role:user.type,isHead:user.isHOD,isCoordinator:user.isCoordinator},jwt_password);
                res.json({token,user});
            }

         }
    }
        catch(err){
            res.status(500).json({error:err.message});
        }
    
})


router.post('/enterNewPass',async(req,res)=>{
    const passNew=req.body.password;
    const passCheck=req.body.passCheck;
    if(password!=passwordCheck){
        return res.status(400).json({msg:"passwords should match"});
    }
    else{
        const salt=await bcrypt.genSalt();             //in case password is weak
        const hashedPassword=await bcrypt.hash(password,salt);
        const userObjectID=StaffMemberModel.find({email:emailFirst})._id
        StaffMemberModel.findByIdAndUpdate(userObjectID,{password:passNew})
    }


    ////token
    const StaffMem=StaffMemberModel.findById(currentUserID)
     if(StaffMem.staff_type=="HR"){
        const jwt_password="Gw%E~gcpf^BFc3b[";
        const token=jwt.sign({id:StaffMem._id,role:StaffMem.staff_type},jwt_password);
        res.json({token,StaffMem});
    }
    else{
        const user=AcademicStaff.findById(StaffMem._id);
        // const role=user.type
        // const isHead=user.isHOD
        // const isCoordinator=user.isCoordinator
        
        const jwt_password="Gw%E~gcpf^BFc3b[";
        const token=jwt.sign({id:StaffMem._id,role:user.type,isHead:user.isHOD,isCoordinator:user.isCoordinator},jwt_password);
        res.json({token,user});
    }

        
})

module.exports=router;