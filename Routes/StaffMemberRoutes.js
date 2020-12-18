const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const router = express.Router();
const AcademicStaff = require('../Models/AcademicStaffModel.js');
const HR = require('../Models/HRModel.js');
const StaffMemberModel = require('../Models/StaffMemberModel.js');

//for first time login will save email
// let emailFirst="";
// let currentUser;
// let currentUserID;


//router.use(express.json())
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
        currentUser=existingUser
        currentUserID=existingUser._id

        if(!existingUser){
            return res.status(400).json({msg:"You are not registered"});
        }
        else{
            //user first login original pass='123456'
            console.log(existingUser.newStaffMember)
            if(existingUser.newStaffMember===true)
                res.json("Please enter new Password")
            //    console.log("enter new pass")
            //     req.url = '/enterNewPass'
            //     /* Uncomment the next line if you want to change the method */
            //     // req.method = 'POST'
            //     return router.handle(req, res, next)
            // return res.redirect('localhost://3000/Routes/StaffMemberRoutes/enterNewPass');
              //  next()
            
           // const isMatched=await bcrypt.compare(password,existingUser.password);       //comparing password entered text with password of the user we got from the database
            const isMatched=true;
            if(isMatched===false){
                 return res.status(400).json({msg:"Please enter correct password"});
             }

             else if(existingUser.staff_type=="HR"){
                const token=jwt.sign({id:existingUser._id,role:existingUser.staff_type},process.env.TOKEN_SECRET);
                res.header('auth-token', token).send(token);
                res.json({token,existingUser});
            }
            else{
                const user=AcademicStaff.findById(existingUser._id);
                const token=jwt.sign({id:existingUser._id,role:user.type,isHead:user.isHOD,isCoordinator:user.isCoordinator},process.env.TOKEN_SECRET);
                res.header('auth-token', token).send(token);
                res.json({token});
            }

         }
        
    }
        catch(err){
            res.status(500).json({error:err.message});
        }
    
})

//user first login shoudl change password hash it and update his account
router.post('/enterNewPass',authenticateToken,async(req,res)=>{

    
   const passNew=req.body.newPassword;
    const passCheck=req.body.passCheck;
    console.log(token.id)
    const user=(await StaffMemberModel.findById(req.user.id))[0]
    console.log(user.email)
    console.log(passNew)
    console.log(passCheck)
    if(passNew!=passCheck){
        return res.status(400).json({msg:"Passwords should match"});
    }
    else{
        const salt=await bcrypt.genSalt();             //in case password is weak
        const hashedPassword=await bcrypt.hash(passNew,salt);
        StaffMemberModel.findByIdAndUpdate(req.user.id,{password:passNew,newStaffMember:false})
        res.json( StaffMemberModel.findByIdAndUpdate(req.user.id))
    }


        
})

function authenticateToken(req,res,next){
   const token=req.headers.token;
  //  const token=req.header('x-auth-token');
    console.log("token= "+token)
    if(!token){
       console.log("here no token")
    return res.sendStatus(401).status('Access deined')
    
    }
    const verified= jwt.verify(token, process.env.TOKEN_SECRET)
    req.user=verified
   
    next();
}

module.exports=router;