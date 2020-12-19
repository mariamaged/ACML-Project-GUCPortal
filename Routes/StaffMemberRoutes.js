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
   //console.log("SignIn= "+SignIn)
    const user=await StaffMemberModel.findById(req.user.id)
    if(user.attendance){
       var attendance=user.attendance
       var date=new Date()
       var time=new Date()
       var hours=0
       var minutes=0
       var last_signIn =0
       var last_signOut=0
       var day="Saturday";
       var signedOut=true;
       
        var idx=-1;
        var attArr=new Array()
        for(var i=0;i<attendance.length;i++){

            var momentA = attendance[i].date;
            var momentB = currentTime.format('YYYY-MM-DD')

            if(momentA==momentB &&attendance[i].signedOut==true ){
                console.log("herer")
                date=attendance[i].date
                time=attendance[i].time
                 hours=attendance[i].hours
                 minutes=attendance[i].minutes
                 last_signIn =SignIn
                 last_signOut=attendance[i].last_signOut
                 day=attendance[i].day
                check=true;
                idx=i;
                
            }
            else if(momentA==momentB &&attendance[i].signedOut==false )
                return res.send("This user is already signed in")
            attArr[i]=attendance[i];

        }
        if(check===true){
            const newAtt=new AttendanceSchema({
                date:date,
                time:time,
                hours:hours,
                minutes:minutes,
                signedIn:true,
                signedOut:false,
                last_signIn:last_signIn,
                last_signOut:last_signOut,
                last_calculated_signOut:last_signIn,
                day:day
            })
            attArr[idx]=newAtt
            
            const up=await StaffMemberModel.findByIdAndUpdate(req.user.id,{attendance:attArr})
            const user= await StaffMemberModel.findById(req.user.id)
            const att=user.attendance[idx].last_signIn
            const dateToday=user.attendance[idx].date
            const signedInToday=user.attendance[idx].signedIn
            const lastCal=user.attendance[idx].last_calculated_signOut
          //  console.log("signed in true= "+signedInToday)
            return res.json({name:user.name,date:dateToday,last_signIn:(moment(att).format("HH:mm")),
            signedIn:signedInToday,last_calculated_signOut:(moment(lastCal).format("HH:mm"))})
        }
    }
    if(check===false || user.attendance.length==0){
        const newSignInDate=moment.utc(new moment()).format('YYYY-MM-DD');
           // console.log("new date= "+newSignInDate)
            const newAttendance=new AttendanceSchema({
                date:newSignInDate,
                time,
                hours,
                minutes,
                signedIn:true,
                signedOut:false,
                last_signIn:SignIn,
                last_calculated_signOut:SignIn,
                last_signOut,
                day
            })
            console.log("SignIn= "+SignIn)
            console.log("newAttendance "+newAttendance)
        if(check===false){
           const attArr=user.attendance
           attArr[attArr.length]=newAttendance
           const update=await StaffMemberModel.findByIdAndUpdate(req.user.id,{attendance:attArr})
            const userNow= await StaffMemberModel.findById(req.user.id)
            const dateToday=userNow.attendance[attendance.length-1].date
            const att=userNow.attendance[attendance.length-1].last_signIn
            const signedInToday=userNow.attendance[attendance.length-1].signedIn
            console.log("att= "+(moment(att).format("HH:mm")))
            return res.json({name:userNow.name,date:dateToday,last_signIn:(moment(att).format("HH:mm")),
            signedIn:signedInToday})
        }
        else{
           const attArr=new Array()
           attArr[0]=newAttendance
           console.log(attendance)
           const update=await StaffMemberModel.findByIdAndUpdate(req.user.id,{attendance:attArr})
           const user= await StaffMemberModel.findById(req.user.id)
           const att=user.attendance[0].last_signIn
           const dateToday=user.attendance[0].date
           const signedInToday=user.attendance[0].signedIn
           return res.json({name:user.name,date:dateToday,last_signIn:(moment(att).format("HH:mm")),
                            signedIn:signedInToday})
        }
        

    }
    
})

router.put('/signout',authenticateToken,async(req,res)=>{
    var datetime = new Date();
    var check=false;
    const SignOut=moment()
    //(moment(currentTime).format("HH:mm"))
    var currentTime = moment();
    const user=await StaffMemberModel.findById(req.user.id)
    if(user.attendance){
       var attendance=user.attendance
       var date=new Date()
       var time=new Date()
       var hours=0
       var minutes=0
       var last_signIn =0
       var last_signOut=0
       var day="Saturday";
       var signedIn=false;
      // var last_calculated_signOut;
        var idx=-1;
        var attArr=new Array()
        for(var i=0;i<attendance.length;i++){

            var momentA = attendance[i].date;
            var momentB = currentTime.format('YYYY-MM-DD')
            // console.log("momentA= "+momentA)
            // console.log("momentB= "+momentB)
            
            if(momentA==momentB && attendance[i].last_signIn ){

                   //subtract signout and signin to get hours
                   var start = moment(attendance[i].last_calculated_signOut);
                   console.log("start= "+start.format('HH:mm'))
                   var end = moment(SignOut); 
                //    console.log("start "+start.format("HH:mm"))
                    console.log("end "+end.format("HH:mm"))
                   
                   //get date today and time at 7 form new moment object to compare 
                   //if person is signing out after 7 we will not count extra hours will set end=19:00
                   var date = new moment().format('YYYY-MM-DD')
                  // console.log("date= "+date)
                   var time = "19:00";
                   datetime = moment(date + ' ' + time).format();
                 //  console.log("datetime= "+datetime)
                   var minutes = end.diff(datetime, 'minutes');
                   var interval = moment().hour(0).minute(minutes);
                   
                 //  console.log("check= "+end.isBefore(datetime));
                   //if person is signingout after 7 
                   if((end.isBefore(datetime))==false){
                   var date = new moment().format('YYYY-MM-DD')
                 //  console.log("date= "+date)
                   var time = "19:00";
                   end = moment(date + ' ' + time);
                 //  console.log("end= "+end)
                   
                   }
                   var minutes = end.diff(start, 'minutes');
                   var interval = moment().hour(0).minute(minutes);
                //   console.log(interval.format("HH:mm"));


                  var hrs=moment.duration(interval.format("HH:mm")).get('hours')
                   var minute=moment.duration(interval.format("HH:mm")).get('minutes')

                    console.log("hours= "+hrs)
                    console.log("minutes= "+minute)

                    if(minute=='0' && hrs=='0'){
                        last_calculated_signOut=attendance[i].last_calculated_signOut
                        console.log("inside if"+moment(last_calculated_signOut).format("HH:mm"))
                }
                    else 
                    last_calculated_signOut=SignOut


                  var fin=minute+attendance[i].minutes
                 console.log("attendance[i].signedIn= "+attendance[i].signedIn)
                    if(attendance[i].miuntes+minutes>60){
                        console.log("signedin true")
                        hrs=hrs+1
                        fin=minute+attendance[i].minutes-60
                    }


                console.log("herer")
                date=attendance[i].date
                time=attendance[i].time
                 hours=hrs+attendance[i].hours
                 minutes=fin
                 signedIn=false
                 
                 last_signIn =attendance[i].last_signIn
                 console.log(moment(last_signIn).format("HH:mm"))
                 last_signOut=SignOut
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
                attended:true,
                hours:hours,
                minutes:minutes,
                signedIn:false,
                last_signIn:last_signIn,
                last_calculated_signOut:last_calculated_signOut,
                last_signOut:last_signOut,
                day:day
            })
            attArr[idx]=newAtt
            const up=await StaffMemberModel.findByIdAndUpdate(req.user.id,{attendance:attArr})
            const user= await StaffMemberModel.findById(req.user.id)
            const signin=user.attendance[idx].last_signIn
            const signout=user.attendance[idx].last_signOut
            const dateToday=user.attendance[idx].date
            const lastCal=user.attendance[idx].last_calculated_signOut
            return res.json({name:user.name,date:dateToday,last_signIn:(moment(signin).format("HH:mm")),last_signOut:(moment(signout).format("HH:mm")),
        hours:hours,minutes:minutes,signedIn:signedIn,
    last_calculated_signOut:(moment(lastCal).format("HH:mm"))})
        }
    }
    if(check===false || user.attendance.length==0){
            //console.log("check= "+check)
            return res.json("Cannot sign out without prior signin")
        
    }
})

router.get('/attendanceRecords',authenticateToken,async(req,res)=>{
    const user=await StaffMemberModel.findById(req.user.id)
   // if(user.attendance){
        
        const attendace=user.attendance.sort(compare)
        if(user.attendance.length>0){
            console.log("in attendance list")
            for(var i=0;i<user.attendance.length;i++){
                const currDay=user.attendance[i]
                res.json({date:currDay.date,attended:currDay.attended,
                    last_signIn:(moment(currDay.last_signIn).format("HH:mm")),
                    last_signOut:(moment(currDay.last_signOut).format("HH:mm")),
                hours:currDay.hours,minutes:currDay.minutes})
            }
        }
//}
    else{
        console.log("in else empty")
        return res.json(user.attendance)
    }
    
})
function compare( a, b ) {
    if ( a.date < b.date ){
      return -1;
    }
    if ( a.date > b.date ){
      return 1;
    }
    return 0;
  }
module.exports=router;


// var start = moment("2020-12-19T12:00:14.362+00:00");
// var end = moment("2020-12-19T17:59:40.765+00:00"); 
// console.log("start "+start.format("HH:mm"))
// console.log("end "+end.format("HH:mm"))


// var date = new moment().format('YYYY-MM-DD')
// console.log("date= "+date)
// var time = "19:00";
// datetime = moment(date + ' ' + time).format();
// console.log("datetime= "+datetime)
// var minutes = end.diff(datetime, 'minutes');
// var interval = moment().hour(0).minute(minutes);
// console.log("down "+minutes)
// //console.log(moment('2020-12-19T14:48:06.775+00:00').diff(moment('2020-12-19T14:48:06.775+00:00'),'minutes'))
// console.log("check= "+end.isBefore(datetime));

// if((end.isBefore(datetime))==false){
// var date = new moment().format('YYYY-MM-DD')
// console.log("date= "+date)
// var time = "19:00";
// end = moment(date + ' ' + time);
// console.log("end= "+end)

// }
// var minutes = end.diff(start, 'minutes');
// var interval = moment().hour(0).minute(minutes);
// console.log(interval.format("HH:mm"));
// console.log(moment.duration(interval.format("HH:mm")).get('hours'))
// console.log(moment.duration(interval.format("HH:mm")).get('minutes'))
///////////////////////////////////////////////////
// var ms = moment(end,"DD/MM/YYYY HH:mm").diff(moment(start,"DD/MM/YYYY HH:mm"));
// var d = moment.duration(ms);
// var dh=d.get('hours')
// var dm=d.get('minutes')
// // var s = Math.floor(d.asHours()) + moment.utc(ms).format("HH:mm")
// //  console.log('dh= '+dh+" dm= "+dm)

/////////////////////////////////////////////////////////////////////////////////