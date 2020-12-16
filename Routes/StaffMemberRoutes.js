const express=require('express')
const router=express.Router()
const AcademicStaff=require('../Models/AcademicStaffModel.js')
const StaffMember=require('../Models/StaffMemberModel.js')
const HR=require('../Models/HRModel.js')



router.post('/login',async(req,res)=>{
    try{
        const{email,password}=req.body;
        if(!email || !password){
            return res.status(400).json("Please enter valid email and password");
        }
        const existingUser=await StaffMembers.findOne({email:email})
        if(!existingUser){
            return res.status(400).json({msg:"You are not registered"});
        }
        else{
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

module.exports=router;