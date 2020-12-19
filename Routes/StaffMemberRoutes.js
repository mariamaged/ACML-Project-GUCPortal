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
       var date=new moment()
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
            const hour=user.attendance[idx].hours
            const minute=user.attendance[idx].minutes
          //  console.log("signed in true= "+signedInToday)
            return res.json({name:user.name,date:(moment(dateToday).format("YYYY-MM-DD")),last_signIn:(moment(att).format("HH:mm")),
            signedIn:signedInToday,hours:hour,minutes:minute})
        }
    }
    if(check===false || user.attendance.length==0){
        const newSignInDate=new moment()
       // moment.utc( //).format('YYYY-MM-DD');
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
            return res.json({name:userNow.name,date:(moment(dateToday).format("YYYY-MM-DD")),last_signIn:(moment(att).format("HH:mm")),
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
           return res.json({name:user.name,date:(moment(dateToday).format("YYYY-MM-DD")),last_signIn:(moment(att).format("HH:mm")),
                            signedIn:signedInToday})
        }
        

    }
    
})

router.put('/signout',authenticateToken,async(req,res)=>{
    var datetime = new moment();
    var check=false;
    const SignOut=moment()
    var currentTime = moment();
    const user=await StaffMemberModel.findById(req.user.id)
    if(user.attendance){
       var attendance=user.attendance
       var date=new moment()
       var time=new Date()
       var hours=0
       var minutes=0
       var last_signIn =0
       var last_signOut=0
       var day="Saturday";
       var signedIn=false;
        var idx=-1;
        var attArr=new Array()
        for(var i=0;i<attendance.length;i++){

            var momentA = attendance[i].date;
            var momentB = currentTime.format('YYYY-MM-DD')
            
            if(momentA==momentB && attendance[i].last_signIn && attendance[i].signedOut==false ){

             
                   var start = moment(attendance[i].last_signIn);
                   console.log("start= "+start.format('HH:mm'))
                   var end = moment(SignOut); 
                    console.log("end "+end.format("HH:mm"))
                   
                   //get date today and time at 7 form new moment object to compare 
                   //if person is signing out after 7 we will not count extra hours will set end=19:00

                   //datetime at 7pm
                   var date = new moment().format('YYYY-MM-DD')
                   var time = "19:00";
                   datetime = moment(date + ' ' + time).format();
                   var minutes = end.diff(datetime, 'minutes');
                   var interval = moment().hour(0).minute(minutes);


                   //datetime at 7am
                   var date = new moment().format('YYYY-MM-DD')
                   var time = "07:00";
                   datetime2 = moment(date + ' ' + time).format();
                   var minutes = end.diff(datetime, 'minutes');
                   var interval = moment().hour(0).minute(minutes);
                    console.log("datetime2= "+moment(datetime2).format("HH:mm"))

                   //if person is signingout after 7 
                   if((end.isBefore(datetime))==false){
                   var date = new moment().format('YYYY-MM-DD')
                 //  console.log("date= "+date)
                   var time = "19:00";
                   end = moment(date + ' ' + time);
                   console.log("new end= "+moment(end).format("HH:mm"))
                   }
                  

                   //if person is signing in before 7
                   if((start.isBefore(datetime2))==true){
                    var date = new moment().format('YYYY-MM-DD')
                  //  console.log("date= "+date)
                    var time = "07:00";
                    start = moment(date + ' ' + time);
                    console.log("new start= "+moment(start).format("HH:mm"))
                    }

                    //calculating difference between start and end
                    if((start.isBefore(end))==true){
                    console.log("new start= "+moment(start).format("HH:mm"))
                    console.log("new end= "+moment(end).format("HH:mm"))
                    var minutes = end.diff(start, 'minutes');
                    var interval = moment().hour(0).minute(minutes);
                    var hrs=moment.duration(interval.format("HH:mm")).get('hours')
                    var minute=moment.duration(interval.format("HH:mm")).get('minutes')
                    }
                    else{
                        var hrs=0
                        var minute=0 
                    }


                    console.log("hours= "+hrs)
                    console.log("minutes= "+minute)

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
            else if(momentA==momentB && attendance[i].last_signIn && attendance[i].signedOut==true )
            return res.send("This user has already signed out")
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
                signedOut:true,
                last_signIn:last_signIn,
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
            return res.json({name:user.name,date:(moment(dateToday).format("YYYY-MM-DD")),last_signIn:(moment(signin).format("HH:mm")),last_signOut:(moment(signout).format("HH:mm")),
        hours:hours,minutes:minutes,signedIn:signedIn})
        }
    }
    if(check===false || user.attendance.length==0){
            return res.json("Cannot sign out without prior signin")
        
    }
})

router.get('/attendanceRecords',authenticateToken,async(req,res)=>{
    const user=await StaffMemberModel.findById(req.user.id)
   // if(user.attendance){
        const attendance=user.attendance
        const sorted=attendance.sort(compare)
        var month=false;
        if(req.body.month){
            month=true;
            if(req.body.month<=0 || req.body.month>=13)
                return res.send("Please enter correct month")
        }
       // console.log(sorted)
        //console.log(attendance)
        var arr=new Array()

        if(user.attendance.length>0){
            // console.log("in attendance list")
            // console.log("length "+user.attendance.length)
            for(var i=0;i<user.attendance.length;i++){
                const currDay=user.attendance[i]
                //console.log("currday= "+currDay)
                if(month ){
                     const dateMonth=moment(currDay.date).format("M")
                     console.log("month= "+dateMonth)
                    if(dateMonth==req.body.month)
                     arr[i]=({date:moment(currDay.date).format("YYYY-MM-DD"),attended:currDay.attended,
                                last_signIn:(moment(currDay.last_signIn).format("HH:mm")),
                                last_signOut:(moment(currDay.last_signOut).format("HH:mm")),
                                 hours:currDay.hours,minutes:currDay.minutes})

                }

                 else
                arr[i]=({date:moment(currDay.date).format("YYYY-MM-DD"),attended:currDay.attended,
                    last_signIn:(moment(currDay.last_signIn).format("HH:mm")),
                    last_signOut:(moment(currDay.last_signOut).format("HH:mm")),
                hours:currDay.hours,minutes:currDay.minutes})
            }
            res.json({attendance:arr})
        }



//}
    else{
        console.log("in else empty")
        return res.json(user.attendance)
    }
    
})
function compare( a, b ) {
   
    // if (parseInt( a.date) < parseInt(b.date) ){
    //     console.log("inside compare")
    //   return -1;
    // }
    // if ( parseInt(a.date )>parseInt( b.date) ){
    //   return 1;
    // }
    // return 0;
    // if(moment(a.date).isBefore(moment(b.date)))
    // return -1;
    // if(moment(b.date).isBefore(moment(a.date)))
    // return 1;
    // return 0;

    if((moment(a.date).format("YYYY-MM-DD"))<((moment(b.date).format("YYYY-MM-DD")))){
        
    return 1;

    }
    if((moment(b.date).format("YYYY-MM-DD"))<((moment(a.date).format("YYYY-MM-DD")))){
        console.log("b= "+(moment(b.date).format("YYYY-MM-DD")))
        console.log("a= "+(moment(a.date).format("YYYY-MM-DD")))
        return -1;
    }
    return 0;
  }
module.exports=router;

//console.log('2020-10-10'<'2020-12-17')
//console.log((parseInt("2020-10-1")>parseInt("2019-12-78")))
// const x=moment("2020-09-09")
// const y=moment("2020-10-01")
// console.log(y.isBefore(x))
// var month = new moment()
// console.log(month.format("M"))
//console.log(month.month())