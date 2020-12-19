const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcrypt');
const router = express.Router();
const AcademicStaff = require('../Models/AcademicStaffModel.js');
const HR = require('../Models/HRModel.js');
const StaffMemberModel = require('../Models/StaffMemberModel.js');
const HRModel = require('../Models/HRModel.js');
const AcademicStaffModel = require('../Models/AcademicStaffModel.js');
const Course=require('../Models/CourseModel.js')
const location=require('../Models/LocationModel.js')
const department=require('../Models/DepartmentModel.js')
const faculty=require('../Models/FacultyModel.js')
const AttendanceSchema=StaffMemberModel.attendanceSchema
var moment = require('moment');

function authenticateToken(req,res,next){
    const token=req.header('x-auth-token');
    if(!token){
    return res.sendStatus(401).status('Access deined')
    
    }
    const verified= jwt.verify(token, process.env.TOKEN_SECRET)
    req.user=verified
   
    next();
}

//login
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
            // if(existingUser.newStaffMember===true){
            //     res.status(500).json("Please enter new password")
            // }
            
            
            const isMatched=await bcrypt.compare(password,existingUser.password);       //comparing password entered text with password of the user we got from the database            
            if(existingUser.newStaffMember===false && isMatched===false){
                 return res.status(400).json({msg:"Please enter correct password"});
             }
             
             else if(existingUser.staff_type=="HR"){
                const token=await jwt.sign({id:existingUser._id,role:existingUser.staff_type,academic_role:'',isHead:false,isCoordinator:false},process.env.TOKEN_SECRET);
               // res.header('auth-token', token).send(token);
               if(existingUser.newStaffMember===true){
                return res.status(500).json({error:"Please enter new password ",token:token})
                }
             return  res.json({token,existingUser});
            }
            else{
                
                const user=await AcademicStaff.findOne({member:existingUser._id});
                console.log("user= "+user)
                const token=await jwt.sign({id:existingUser._id,role:existingUser.staff_type,academic_role:user.type,isHead:user.isHOD,isCoordinator:user.isCoordinator},process.env.TOKEN_SECRET);
               // res.header('auth-token', token).send(token);
               if(existingUser.newStaffMember===true){
                return  res.status(500).json({err:"Please enter new password ",token:token})
            }
            return  (res.json({token}));

         }
        
    }
}
        catch(err){
          return  res.status(500).json({error:err.message});
        }
    
})

//user first login should change password hash it and update his account
router.put('/enterNewPass',authenticateToken,async(req,res)=>{

    
    const passNew=req.body.newPassword;
    const passCheck=req.body.passCheck;
    const user=await StaffMemberModel.findById(req.user.id)
    if(passNew!=passCheck){
        return res.status(400).json({msg:"Passwords should match"});
    }
    else{
        console.log("in else")
        console.log(req.user.id)
        const salt=await bcrypt.genSalt();     
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

// //logout
// router.get('/logout',async(req,res)=>{
//     try{

//     console.log("token= "+req.header('x-auth-token'))
// }
//     catch(err){
//         res.status(500).send("error "+err)
//     }
// })

router.get('/profile',authenticateToken,async(req,res)=>{
    console.log("in profile")
    const role=req.user.role
    if(role=='HR'){
        const staff=await StaffMemberModel.findById(req.user.id);
        const HR=await HRModel.findOne({member:req.user.id})
        res.json({name:staff.name,
            id:staff.id,
            email:staff.email,
            salay:staff.salary,
            office:(await location.findById(staff.office)).id,
            staff_type:staff.staff_type,
            day_off:HR.day_off
        })
    }
    else{
        const staff=await StaffMemberModel.findById(req.user.id);
        const academic=await AcademicStaffModel.findOne({member:req.user.id})
      const courses= (await Course.findById(academic.courses))
      var arr=new Array()
      if(courses){
      for(var i=0;i<courses.length;i++)
            arr[i]=courses[i].name
      }
        res.json({name:staff.name,
            id:staff.id,
            email:staff.email,
            salay:staff.salary,
            office:(await location.findById(staff.office)).id,
            staff_type:staff.staff_type,
            day_off:academic.day_off,
            department:(await department.findById(academic.department)).name, 
            faculty:(await faculty.findById(academic.faculty)).name, 
            courses:arr,

          /////SCHEDULEEEEEEEE
    
            type:academic.type,
            isHeadOfDepartment:academic.isHOD,
            isCourseCoordinator:academic.isCourseCoordinator,
        })
        
    }
})


/////////left updating schedule,,,,,CAN WE UPDATE ISHOD AND ISCOORINDATOR AND TYPE AND DAY OFF?????-----------------------
router.put('/updateProfile',authenticateToken,async(req,res)=>{
    
    //.log("req.user= "+req.user)
    const role=req.user.role
    
    const user=await StaffMemberModel.findById(req.user.id)
    console.log("user= "+user)
    if(req.body.id)
       return res.json("Cannot change id")
     if(req.body.name)   
       return res.json("Cannot change name")
       if(req.body.day_off)
       return res.json("Must make a request to change day-off")
    
    var email=''
    var password=''
    var office=''
    var courses=''
    var staff_type=''

     //update email
     if(req.body.email)
        email=req.body.email
      else
      email= user.email

      console.log("email= "+email)
    //update password
      if(req.body.password){
      const salt=await bcrypt.genSalt();     
      const hashedPassword=await bcrypt.hash(req.body.password,salt);
      password=hashedPassword
      }
    else{
        console.log("pass= "+user.password)
        password= user.password

    }

    //update staff typee don't know if possible
    if(req.body.staff_type)
        staff_type=req.body.staff_type
    else
        staff_type = user.staff_type

    if(req.user.role=="HR")
        return  res.json(await StaffMemberModel.findByIdAndUpdate(req.user.id,{email:email,password:password,staff_type:staff_type}))

    else{
        if(req.body.salary) 
            return res.json("Cannot change salary")
        if(req.body.department) 
           return res.json("Cannot change department")
        if(req.body.faculty) 
            return res.json("Cannot change faculty")

            const academicUser=AcademicStaffModel.findOne({member:req.user.id})
        const academicUserID=academicUser.id
        var courses=''
        var day_off=''
    //if replacing old courses
    if(req.body.courses){
         courses=new Array(req.body.courses.length)
        for(var i=0;i<req.body.courses.length;i++){
            courses[i]=Course.findOne({id:req.body.courses[i]})
        }
    }
    else
        courses=academicUser.courses

    //update day-off
    // if(req.body.day_off)
    //     day_off=req.body.day_off
    // else
    //     day_off=academicUser.day_off         
    
   const staff1= (await StaffMemberModel.findByIdAndUpdate(req.user.id,{email:email,password:password,staff_type:staff_type}))
    const academic1=(await AcademicStaffModel.findOneAndUpdate({id:academicUserID},{courses:courses,day_off:day_off}))
    //I had to do it on 2 steps otherwise old results were produced
     const staff=await StaffMemberModel.findById(req.user.id);
    const academic=await AcademicStaffModel.findOne({member:req.user.id})
      const coursesNew= (await Course.findById(academic.courses))
      var arr=new Array()
      if(coursesNew){
      for(var i=0;i<coursesNew.length;i++)
            arr[i]=coursesNew[i].name
      }
        res.json({name:staff.name,
            id:staff.id,
            email:staff.email,
            salay:staff.salary,
            office:(await location.findById(staff.office)).id,
            staff_type:staff.staff_type,
            day_off:academic.day_off,
            department:(await department.findById(academic.department)).name, 
            faculty:(await faculty.findById(academic.faculty)).name, 
            courses:arr,

          /////SCHEDULEEEEEEEE
    
            type:academic.type,
            isHeadOfDepartment:academic.isHOD,
            isCourseCoordinator:academic.isCourseCoordinator,
        })
        
}
})

router.put('/resetPassword',authenticateToken,async(req,res)=>{
        const user=await StaffMemberModel.findById(req.user.id)
        const userPass=user.password
        //console.log(user+" userPass= "+userPass)
        const oldPass=req.body.oldPass
        const isMatched=await bcrypt.compare(oldPass,user.password); 
        console.log(isMatched)
        if(!isMatched)
        return res.json("Please enter correct old password")
        const newPass=req.body.newPass
        const checkPass=req.body.checkPass
        if(newPass!=checkPass)
       return res.json("Passwords do not match")
        const salt=await bcrypt.genSalt();     
        const hashedPassword=await bcrypt.hash(newPass,salt);
        const userUpdated=await StaffMemberModel.findByIdAndUpdate(req.user.id,{password:hashedPassword})
        const userUpdated2=await StaffMemberModel.findById(req.user.id)
        // console.log(userUpdated.password)
        res.json(userUpdated2)
})
//USE MOMENT LIBRARY moment().utc().format('hh:mm:ss') 
router.put('/signin',authenticateToken,async(req,res)=>{
    var datetime = new Date();
    var check=false;
    const SignIn=moment()
    //(moment(currentTime).format("HH:mm"))
    var currentTime = moment();
    //console.log(datetime.toISOString().slice(0,10))
    console.log("SignIn= "+SignIn)
    const user=await StaffMemberModel.findById(req.user.id)
    if(user.attendance){
       var attendance=user.attendance
       var date=new Date()
       var time=new Date()
       var hours=0
       var last_signIn =0
       var last_signOut=0
       var day="Saturday";
        var idx=-1;
        var attArr=new Array()
        for(var i=0;i<attendance.length;i++){
            // console.log("date i= "+attendance[i].date.toISOString().substring(0, 10))
            // console.log(new Date().toISOString().substring(0, 10))

            var momentA = attendance[i].date;
            var momentB = currentTime.format('YYYY-MM-DD')
            console.log("momA= "+momentA)
            console.log("momB= "+momentB)


           // if(attendance[i].date.toISOString().substring(0, 10)==(new Date().toISOString().substring(0, 10))){
            if(momentA==momentB){
                console.log("herer")
                date=attendance[i].date
                time=attendance[i].time
                 hours=attendance[i].hours
                 last_signIn =SignIn
                 last_signOut=attendance[i].last_signOut
                 day=attendance[i].day
                check=true;
                idx=i;
                
            }
            attArr[i]=attendance[i];

        }
        if(check===true){
            const newAtt=new AttendanceSchema({
                date:date,
                time:time,
                hours:hours,
                last_signIn:last_signIn,
                last_signOut:last_signOut,
                day:day
            })
            attArr[idx]=newAtt
            const up=await StaffMemberModel.findByIdAndUpdate(req.user.id,{attendance:attArr})
            const user= await StaffMemberModel.findById(req.user.id)
            const att=user.attendance[idx].last_signIn
            const dateToday=user.attendance[idx].date
            return res.json({name:user.name,date:dateToday,last_signIn:(moment(att).format("HH:mm"))})
        }
    }
    if(check===false || user.attendance.length==0){
        const newSignInDate=new Date().toDateString();

            const newAttendance=new AttendanceSchema({
                date:newSignInDate,
                time,
                hours,
                last_signIn:SignIn,
                last_signOut,
                day
            })
            console.log("SignIn= "+SignIn)
            console.log("newAttendance "+newAttendance)
        if(check===false){
           const attArr=user.attendance
           attArr[attArr.length]=newAttendance
           console.log("attArr "+attArr)
           const update=await StaffMemberModel.findByIdAndUpdate(req.user.id,{attendance:attArr})
            const userNow= await StaffMemberModel.findById(req.user.id)
            const dateToday=userNow.attendance[attendance.length-1].date
            const att=userNow.attendance[attendance.length-1].last_signIn
            console.log("att= "+(moment(att).format("HH:mm")))
            return res.json({name:userNow.name,date:dateToday,last_signIn:(moment(att).format("HH:mm"))})
            //return res.json("done")
        }
        else{
           const attArr=new Array()
           attArr[0]=newAttendance
           console.log(attendance)
           const update=await StaffMemberModel.findByIdAndUpdate(req.user.id,{attendance:attArr})
           const user= await StaffMemberModel.findById(req.user.id)
           const att=user.attendance[0].last_signIn
           const dateToday=user.attendance[0].date
           return res.json({name:user.name,date:dateToday,last_signIn:(moment(att).format("HH:mm"))})
        }
        

    }
    
})


// // {
//     "_id": "5fdd11ddf4e4d03ed83f8ac6",
//     "date": "2020-12-12T00:00:00.000Z",
//     "last_signIn": "2020-12-18T20:32:29.193Z",
//     "last_signOut": "2020-12-18T20:32:29.193Z"
// },
// {
//     "_id": "5fdd11ddf4e4d03ed83f8ac7",
//     "date": "2020-10-10T00:00:00.000Z",
//     "last_signIn": "2020-12-18T20:32:29.194Z",
//     "last_signOut": "2020-12-18T20:32:29.194Z"
// },
// {
//     "_id": "5fdd11ddf4e4d03ed83f8ac8",
//     "date": "2020-09-08T22:00:00.000Z",
//     "last_signIn": "2020-12-18T20:32:29.194Z",
//     "last_signOut": "2020-12-18T20:32:29.194Z"
// }

// console.log(moment(currentTime).format("hh:mm"))
//   var currentTime = moment().format('YYYY-MM-DD');
//     const time=moment().toDate().getTime()
//     console.log(time)
//     console.log(time<currentTime)

// const time="2020-12-11"
// console.log(currentTime<time)

// const currentTime=moment()
// const min=moment(currentTime).format("hh:mm")
// console.log(min)


// const currentTime2=moment()
// const min2=moment(currentTime2).format("HH:mm")
// console.log(currentTime2)

// const da=moment('2020-12-18T01:21:29.657Z')
// console.log(da)

// console.log(da.format("HH:mm"))
// console.log(currentTime2.format("HH:mm"))
// console.log(da.format("hh:mm")>currentTime2.format("HH:mm"))
//console.log(moment('2020-12-19T10:48:25.569Z').format("HH:mm"))


module.exports=router;