// // For hashing passwords.
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// // For routing.
// const express = require('express');
// const router = express.Router();

// // For models.
// const StaffMemberModel = require('../Models/StaffMemberModel.js');
// const AcademicStaffModel = require('../Models/AcademicStaffModel.js');

// // For environmental variables.
// require('dotenv').config();

// router.route('/login')
// .post(async (req, res) => {
//     const {email, password} = req.body;
//     if(!email){
//         return res.status(400).send("Please enter a valid email.");
//     }
//     if(!password){
//         return res.status(400).send("Please enter a valid password.");
//     }
//     const existingUser = await StaffMemberModel.findOne( {email: email} );

//     if(!existingUser){
//         return res.status(401).send("You are not registered.");
//     }

//     const correctPassword = await bcrypt.compare(password, existingUser.password);

//     if(!correctPassword){
//         return res.status(400).send("Please enter a correct password");
//     }

//     if(existingUser.staff_type === "HR"){
//         const token = jwt.sign({_id: existingUser._id, role: existingUser.staff_type}, process.env.TOKEN_SECRET);
//         res.header('auth-token', token).send(token);
//     }
//     else {
//         const jwt = {_id: existingUser._id, role: existingUser.staff_type};
//         const academicUser = AcademicStaffModel.findOne({member: existingUser._id});
//         if(academicUser.isHOD) jwt.isHOD = true;
//         if(academicUser.isCourseCoordinator) jwt.isCourseCoordinator = true;
//         const token = jwt.sign(jwt, process.env.TOKEN_SECRET);
//         res.header('auth-token', token).send(token);
//     }
     
// });

// // Export the router.
// module.exports = router;
