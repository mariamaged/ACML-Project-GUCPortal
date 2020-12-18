// For hashing passwords.
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// For routing.
const express = require('express');
const router = express.Router();

// For models.
const StaffMemberModel = require('../Models/StaffMemberModel.js');
const AcademicStaffModel = require('../Models/AcademicStaffModel.js');

// For environmental variables.
require('dotenv').config();

router.route('/login')
.post(async (req, res) => {
    const {email, password} = req.body;
    if(!email){
        return res.status(400).send("Please enter a valid email.");
    }
    if(!password){
        return res.status(400).send("Please enter a valid password.");
    }
    const existingUser = await StaffMemberModel.findOne( {email: email} );

    if(!existingUser){
        return res.status(401).send("You are not registered.");
    }

    const correctPassword = await bcrypt.compare(password, existingUser.password);

    if(!correctPassword){
        return res.status(400).send("Please enter a correct password");
    }

    if(existingUser.staff_type === "HR"){
        const token = jwt.sign({id: existingUser._id, role: existingUser.staff_type, isHOD: false, isCourseCoordinator: false}, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);
    }
    else {
        const loginToken = {id: existingUser._id, role: existingUser.staff_type};
        const academicUser = AcademicStaffModel.findOne({member: existingUser._id});

        if(academicUser.isHOD) loginToken.isHOD = true;
        else loginToken.isHOD = false;
        
        if(academicUser.isCourseCoordinator) loginToken.isCourseCoordinator = true;
        else loginToken.isCourseCoordinator = false;

        const token = jwt.sign(loginToken, process.env.TOKEN_SECRET);
        res.header('auth-token', token).send(token);
    }
     
});

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

// Export the router.
module.exports = router;
