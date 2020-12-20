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
const monthlyHoursSchema=StaffMemberModel.monthlyHoursSchema
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

            var momentA =moment(attendance[i].date).format('YYYY-MM-DD');
            var momentB = currentTime.format('YYYY-MM-DD');
            console.log("momentA= "+momentA)
            console.log("momentB= "+momentB)

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
    console.log("req.user.id= "+req.user.id)
    //if there is attendance to check
    if(user.attendance.length>0){
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
        //searching for a record with this date to check if previously signed in
        for(var i=0;i<attendance.length;i++){
            var momentA = moment(attendance[i].date).format('YYYY-MM-DD');
            var momentB = currentTime.format('YYYY-MM-DD')
            console.log("understand "+ attendance[i].last_signIn )
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

                    var monthlyHours=hrs
                    var monthlyMin=minute

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
        
        
        if(check==true){
            const user= await StaffMemberModel.findById(req.user.id)
            /////////////////////////////////////////////////////////////////////////////
           //we can signout so get hours attended and add to monthly
            const currMonth=new moment().format("M")
            var c=false;
            var newMonthlyArr=new Array()
           // console.log("user= "+user)
            //search in months hours for this person then add new hours and minutesif there is already a record
            //const user=await StaffMemberModel.findById(req.user.id)
            console.log("length= "+user.time_attended.length)
            if(user.time_attended.length>0){
                for(var l=0;l<user.time_attended.length;l++){
                    if(user.time_attended[l].num==currMonth){
                        console.log("found one= "+user.time_attended[l])
                        const prevHours=user.time_attended[l].hours
                        const prevMin=user.time_attended[l].minutes
                        var minTotal=prevMin+monthlyMin
                        if(prevMin+monthlyMin>60){
                            monthlyHours+=1
                            minTotal=prevMin+monthlyMin-60

                        }
                        console.log("prevMin= "+prevMin)
                        console.log("monthlyMin= "+monthlyMin)
                        console.log("minTotal= "+minTotal)
                        //new monthlyTime with updated hours and minutes
                        const newMonthly=new monthlyHoursSchema({
                            num:user.time_attended[l].num
                             ,hours:user.time_attended[l].hours+monthlyHours
                            ,minutes:minTotal
                            ,mustAttendHours:user.time_attended[l].mustAttendHours
                            ,mustAttendMinutes:user.time_attended[l].mustAttendMinutes
                        })
                        //adding updated month to array
                        c=true
                        newMonthlyArr[l]=newMonthly
                    }
                    //adding other months in the array
                    else
                    newMonthlyArr[l]=user.time_attended[l]
                }
                //updating staff member info'
                console.log("will update "+ newMonthlyArr)
                const up=await StaffMemberModel.findByIdAndUpdate(req.user.id,{time_attended:newMonthlyArr})
  
            }
        
            //didn't find record for this month or any records at all should add new record
            if(c==false || user.time_attended.length==0){
                const newMonthly=new monthlyHoursSchema({
                    num:parseInt(currMonth)
                     ,hours:monthlyHours
                    ,minutes:monthlyMin
                })
                //if month array is empty simply add this new record
                if(user.time_attended.length==0){
                    console.log("newMonthly= "+newMonthly)
                    const up=await StaffMemberModel.findByIdAndUpdate(req.user.id,{time_attended:newMonthly})
                //  res.json({monthly:up.time_attended[0]})
                }
                //if array not empty but doesn't contain this month update it
                else {
                    var oldMonthUp=user.time_attended
                    oldMonthUp[oldMonthUp.length-1]=newMonthly
                
                    const up=await StaffMemberModel.findByIdAndUpdate(req.user.id,{time_attended:oldMonthUp})
                  //  res.json(up)
                }
            }




            ///////////////////////////////////////////////////////////////////////////////////
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
           // const user= await StaffMemberModel.findById(req.user.id)
            const signin=user.attendance[idx].last_signIn
            const signout=user.attendance[idx].last_signOut
            const dateToday=user.attendance[idx].date
            const lastCal=user.attendance[idx].last_calculated_signOut
            return res.json({name:user.name,date:(moment(dateToday).format("YYYY-MM-DD")),last_signIn:(moment(signin).format("HH:mm")),last_signOut:(moment(signout).format("HH:mm")),
                hours:hours,minutes:minutes,signedIn:signedIn})
        }
    }


    //no attendance or this day is not found so no prior signin
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
      
        var arr=new Array()
        var idx=0;
        if(user.attendance.length>0){
           
            for(var i=0;i<user.attendance.length;i++){
                const currDay=user.attendance[i]
                if(month ){
                     const dateMonth=moment(currDay.date).format("M")
                    // console.log("month= "+dateMonth)
                    if(dateMonth==req.body.month)
                     arr[idx++]=({date:moment(currDay.date).format("YYYY-MM-DD"),attended:currDay.attended,
                                last_signIn:(moment(currDay.last_signIn).format("HH:mm")),
                                last_signOut:(moment(currDay.last_signOut).format("HH:mm")),
                                 hours:currDay.hours,minutes:currDay.minutes})

                }

                 else
                arr[idx++]=({date:moment(currDay.date).format("YYYY-MM-DD"),attended:currDay.attended,
                    last_signIn:(moment(currDay.last_signIn).format("HH:mm")),
                    last_signOut:(moment(currDay.last_signOut).format("HH:mm")),
                hours:currDay.hours,minutes:currDay.minutes})
            }
            res.json({attendance:arr})
        }



//}
    else{
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
        // console.log("b= "+(moment(b.date).format("YYYY-MM-DD")))
        // console.log("a= "+(moment(a.date).format("YYYY-MM-DD")))
        return -1;
    }
    return 0;
  }

  function compareAsc( a, b ) {
   

    if((moment(a.date).format("YYYY-MM-DD"))<((moment(b.date).format("YYYY-MM-DD")))){
        
    return -1;

    }
    if((moment(b.date).format("YYYY-MM-DD"))<((moment(a.date).format("YYYY-MM-DD")))){
        // console.log("b= "+(moment(b.date).format("YYYY-MM-DD")))
        // console.log("a= "+(moment(a.date).format("YYYY-MM-DD")))
        return 1;
    }
    return 0;
  }


  



//---------------------------SHOULD ADD CONDITION LEAVE REQUEST!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.get('/missingDays',authenticateToken,async(req,res)=>{
    const dateMonth=moment().format("M")
    const dateYear=moment().format("Y")
        const user=await StaffMemberModel.findById(req.user.id)
        const userAttendance=user.attendance
        var userDays=new Array()
        var missedDays=new Array()
        var idx=0;
        var k=0;
        var check=false;
        const day_off=user.day_off
        var nextMonth=0;
        var nextYear=0;
        if(dateMonth==12){
            nextMonth=1
            nextYear=(parseInt(dateYear)+1) 
        }
         else{
         nextMonth=(parseInt(dateMonth)+1)  
         nextYear=dateYear
        }

        //first get list of present days in both months
        for(var i=0;i<userAttendance.length;i++){
            const currDay=userAttendance[i]
            const year=moment(currDay.date).format("Y")
            const month=moment(currDay.date).format("M")
            
            const dayNum=moment(currDay.date).format("D")
            const day=moment(currDay.date).format("dddd")

            //if 1st month will get starting from 11th day
            if(year==dateYear && month==dateMonth && dayNum>=11){
                    userDays[idx++]=userAttendance[i]
            }
             //if 1st month will get till the 10th day
            if(year==nextYear && month==nextMonth  && dayNum<=10){
                userDays[idx++]=userAttendance[i]
            }
        }

        //sort this array to be able to fill missing days in between present days
        const sortedUserDays=userDays.sort(compareAsc)
      //console.log(" sortedUserDays"+sortedUserDays)
        var j=0
        var currDay=11
        var m= moment(sortedUserDays[j].date).format('M')

        //start looping on days of first month to get missing days in between present days
        while(j<sortedUserDays.length && m==dateMonth){
            var d= moment(sortedUserDays[j].date).format('D')
             m= moment(sortedUserDays[j].date).format('M')
                while(d>currDay && m==dateMonth ){
                   const currYear=new moment().format("Y")
                   const currDate=new moment(currYear+"-"+dateMonth+"-"+currDay).format('dddd')
                   if(currDate!=day_off && currDate!='Friday'){
                       missedDays[k++]=new moment(currYear+"-"+dateMonth+"-"+currDay).format("YYYY-MM-DD");
                        console.log("adding "+missedDays[k-1])
                    }
                   currDay++
                }
                currDay++
                j++
                if(j<sortedUserDays.length){
                 m= moment(sortedUserDays[j].date).format('M')

        }
        }
   
    var lastD= moment(sortedUserDays[j-1].date).format('D')
    var lastDName= moment(sortedUserDays[j-1].date).format('dddd')           
    const lastMonth=moment(sortedUserDays[j-1].date).format('M')
    const lastYear=moment(sortedUserDays[j-1].date).format('Y')
    console.log("ld= "+lastD+" lm= "+lastMonth+" ly= "+lastYear)
    var lastDay=parseInt(lastD)+1
 console.log("missed till now= "+missedDays)
        //get last day present from 1st month then fill the rest according to each month's number of days
    if(dateMonth==1 ||dateMonth==3 ||dateMonth==5 ||dateMonth==7 ||dateMonth==8 ||dateMonth==10||dateMonth==12){
        while(lastDay<32){
            if(lastDName!='Friday'){
            missedDays[k++]=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("YYYY-MM-DD");
            console.log("added= "+missedDays[k-1])
            }
           lastDay++
           lastDName=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("dddd");
           console.log("now= "+lastDay)
        }
    }
    if(dateMonth==4 ||dateMonth==6 ||dateMonth==9 ||dateMonth==11 ){
        while(lastDay<31){
            if(lastDName!='Friday'){
            missedDays[k++]=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("YYYY-MM-DD");
            }
            lastDay++;
            lastDName=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("dddd");
        }
    }
    if(dateMonth==2 ){
       if(moment(dateYear).isLeapYear() )
        {
            while(lastDay<30){
             if(lastDName!='Friday'){
              missedDays[k++]=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("YYYY-MM-DD");
            }
            lastDay++;
            lastDName=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("dddd");
        }
        }
        else {
            while(lastDay<29){
                if(lastDName!='Friday'){
            missedDays[k++]=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("YYYY-MM-DD");
                }
            lastDay++;
            lastDName=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("dddd");
        }
    }
    }
    //if only present in first month then fill 2nd month manually
    if(moment(sortedUserDays[sortedUserDays.length-1].date).format("M")==dateMonth){
        var currDay2=1
        lastDName=new moment(nextYear+"-"+nextMonth+"-"+currDay2).format("dddd");
        for(var g=1;g<=10;g++){
            if(lastDName!='Friday'){
            missedDays[k++]=new moment(nextYear+"-"+nextMonth+"-"+currDay2).format("YYYY-MM-DD");
            }
            currDay2++
            lastDName=new moment(nextYear+"-"+nextMonth+"-"+currDay2).format("dddd");
        }
    }

    //else will need to check and only insert absent days
    else{    
    //first fill days missed in the middle
    while(j<sortedUserDays.length && m==nextMonth){
        var currDay2=1
        var last2day=currDay2
         var d2= moment(sortedUserDays[j].date).format('D')
         var m2= moment(sortedUserDays[j].date).format('M')
             while(d2>currDay2 ){
               
                const currDate2=new moment(nextYear+"-"+nextMonth+"-"+currDay2).format('dddd')
                console.log("inside 2nd= "+currDay2+" "+currDate2)

                if(currDate2!=day_off && currDate2!='Friday'){
                    console.log("accepted 2nd= "+currDay2+" "+currDate2)
                    missedDays[k++]=new moment(nextYear+"-"+nextMonth+"-"+currDay2).format("YYYY-MM-DD");
                }
                currDay2++
                last2day=currDay2
             }
             
             currDay2++
             j++
            
     }
    //  console.log("missed till now= "+missedDays)
     //then start looping from last present day till the 10th of 2nd month
     var last2D=moment(sortedUserDays[sortedUserDays.length-1].date).format("D")
     var last2day=parseInt(last2D)+1
    
     for(last2day;last2day<=10;last2day++){
        lastDName=new moment(nextYear+"-"+nextMonth+"-"+last2day).format("dddd");
         if(lastDName!='Friday'){
        missedDays[k++]=new moment(nextYear+"-"+nextMonth+"-"+last2day).format("YYYY-MM-DD");
         }
        
     }
    }


 
        return res.json(missedDays)
})

module.exports=router;

// console.log(new moment("2020-01-01").format("M"))
// const x=new moment("2020-01-01").format("M")
// const check=(x==1)
// console.log(check)
// async  function z(){
// const c=await StaffMemberModel.findById("5fdc24861418851510805d28")
// const g=c.time_attended[0]
// console.log("her "+g.minutes)
// }z()