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
const request=require('../Models/RequestModel.js')

function authenticateToken(req,res,next){
    
    const token=req.header('x-auth-token');
    if(!token){
    return res.sendStatus(401).status('Access deined please log in first.')
    }
    // const verified= jwt.verify(token, process.env.TOKEN_SECRET)
    // if(!verified){
    //     return res.json("Token is unauthorized.")
    // }
    // req.user=verified
    // console.log("in auth "+req.user)
    // next();
    try{
        const verified= jwt.verify(token, process.env.TOKEN_SECRET)
        req.user= verified
        next()
    }
    catch(err){
        res.status(400).send('Invalid Request.')
    }
}
module.exports=authenticateToken
//login
router.post('/login',async(req,res,next)=>{
    console.log("here in login")
    try{
        const{email,password}=req.body;
        if(!email ){
            return res.status(400).json("Please enter a valid email. ");
        }
        if(!password)
        return res.status(400).json("Please enter a valid  password.");

        const existingUser=await StaffMemberModel.findOne({email:email})
        if(!existingUser){
            return res.status(400).json({msg:"This user is not registered."});
        }
        else{
            //user first login original pass='123456'
            // if(existingUser.newStaffMember===true){
            //     res.status(500).json("Please enter new password")
            // }
            
            
            const isMatched=await bcrypt.compare(password,existingUser.password);       //comparing password entered text with password of the user we got from the database            
            if( isMatched===false){
                // return res.status(400).json({error:"Please enter correct password."});
                return res.status(400).send("Please enter correct password.");
             }
             
             else if(existingUser.staff_type=="HR"){
                const token=await jwt.sign({id:existingUser._id,role:existingUser.staff_type,academic_role:'',isHead:false,isCoordinator:false},process.env.TOKEN_SECRET);
               // res.header('auth-token', token).send(token);
               if(existingUser.newStaffMember===true){
                return res.status(500).json({message:"Please enter new password.",token:token})
                }
             return  res.json({token,msg:"User logged in successfully"});
            }
            else{
                
                const user=await AcademicStaff.findOne({member:existingUser._id});
                console.log("user= "+user)
                const token=await jwt.sign({id:existingUser._id,role:existingUser.staff_type,academic_role:user.type,isHead:user.isHOD,isCoordinator:user.isCoordinator},process.env.TOKEN_SECRET);
               // res.header('auth-token', token).send(token);
               if(existingUser.newStaffMember===true){
                return  res.status(500).json({message:"Please enter new password.",token:token})
            }
            return  (res.json({token,msg:"User logged in successfully"}));

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
    if(!passNew)
    return res.json("Please enter a valid new password.")
    if(!passCheck){
        return res.json("Please enter the password check.")
    }
    if(passNew!=passCheck){
        return res.status(400).json({msg:"Passwords should match."});
    }
    else{
        console.log("in else")
        console.log(req.user.id)
        const salt=await bcrypt.genSalt();     
        const hashedPassword=await bcrypt.hash(passNew,salt);
        console.log("hashed pass= "+hashedPassword)
        try{
      await  StaffMemberModel.findByIdAndUpdate(req.user.id,{password:hashedPassword,newStaffMember:false})
      return  res.json("Password changed successfully.")
        }
        catch(err){
           return res.json("Error. Please try again")
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
    const staff=await StaffMemberModel.findById(req.user.id)
    const role=staff.staff_type
    if(role=='HR'){
        const staff=await StaffMemberModel.findById(req.user.id);
        const HR=await HRModel.findOne({member:req.user.id})
        const office=(await location.findById(staff.office))
        var off=""
        if(!office)
        off=""
        else
        off=office.id
        res.json({name:staff.name,
            id:staff.id,
            email:staff.email,
           // salay:staff.salary,
            office:off,
            staff_type:staff.staff_type,
            day_off:HR.day_off
        })
    }
    else{
        const staff=await StaffMemberModel.findById(req.user.id);
        const academic=await AcademicStaffModel.findOne({member:req.user.id})
    //   const courses= (await Course.findById(academic.courses))
    //   var arr=new Array()
    //   if(courses){
    //   for(var i=0;i<courses.length;i++)
    //         arr[i]=courses[i].name
    //   }
        const dep=(await department.findById(academic.department))
        var depName=""
        if(!dep)
        depName=""
        else
        depName=dep.name
     
        const fac=(await faculty.findById(academic.faculty))
        var facName=""
        if(!fac)
        facName=""
        else
        facName=fac.name

        const loc=(await location.findById(staff.office))
        var locName=""
        if(!loc)
        locName=""
        else
        locName=loc.id
        

        res.json({name:staff.name,
            id:staff.id,
            email:staff.email,
            // salary:staff.salary,
            office:(await location.findById(staff.office)).id,
            staff_type:staff.staff_type,
            day_off:academic.day_off,
            department:depName, 
            faculty:facName, 
            //courses:arr,

          /////SCHEDULEEEEEEEE
    
            type:academic.type
            //, isHeadOfDepartment:academic.isHOD,
            // isCourseCoordinator:academic.isCourseCoordinator,
        })
        
    }
})


/////////left updating schedule,,,,,CAN WE UPDATE ISHOD AND ISCOORINDATOR AND TYPE AND DAY OFF?????-----------------------
router.put('/updateProfile',authenticateToken,async(req,res)=>{
    
    const user=await StaffMemberModel.findById(req.user.id)
    const role=user.staff_type
    console.log("user= "+user)
    if(req.body.id)
       return res.json("Cannot change ID.")
     if(req.body.name)   
       return res.json("Cannot change name.")
       if(req.body.day_off)
       return res.json("Must make a request to change day-off.")
    
    var email=''
    var office=''

     //update email
     if(req.body.email){
         const mailPresent=await StaffMemberModel.findOne({email:req.body.email})
         if(mailPresent){
             return res.json("This email is already registered. Please enter a new one.")
         }
        email=req.body.email

     }
      else
      email= user.email

      console.log("email= "+email)
    //update password
      if(req.body.password){
          return res.json("Cannot change password.Please make a reset pasword request.")
      }
    

    

    if(role=="HR"){
         (await StaffMemberModel.findByIdAndUpdate(req.user.id,{email:email}))
         return res.json("Profile updated successfully.")
    }
    else{
        if(req.body.salary) 
            return res.json("Cannot change salary.")
        if(req.body.department) 
           return res.json("Cannot change department.")
        if(req.body.faculty) 
            return res.json("Cannot change faculty.")

        // const academicUser=AcademicStaffModel.findOne({member:req.user.id})
        // const academicUserID=academicUser.id
       
   // var off=""
    var offID=""
        if(req.body.office){
           const off=await location.findOne({id:req.body.office})
            console.log("offfffffffffff="+off)
            if(!off)
            return res.json("This office does not exist.Please enter a valid office ID.")
            offID=off._id
        }
        else{
            offID=user.office
        }
        
    
   const staff1= (await StaffMemberModel.findByIdAndUpdate(req.user.id,{email:email,office:offID}))
  
        res.json("Profile updated successfully")
        
}
})

router.put('/resetPassword',authenticateToken,async(req,res)=>{
        const user=await StaffMemberModel.findById(req.user.id)
        const userPass=user.password
        //console.log(user+" userPass= "+userPass)
        const oldPass=req.body.oldPass
        if(!oldPass){
            return res.json("Please enter old password.")
        }
        const isMatched=await bcrypt.compare(oldPass,user.password); 
        console.log(isMatched)
        if(!isMatched)
        return res.json("Please enter correct old password")
        const newPass=req.body.newPass
        if(!newPass)
        return res.json("Please enter valid new password.")
        const checkPass=req.body.checkPass
        if(!checkPass){
            return res.json("Please enter password check.")
        }
        if(newPass!=checkPass)
       return res.json("Passwords do not match")

        const salt=await bcrypt.genSalt();     
        const hashedPassword=await bcrypt.hash(newPass,salt);

        try{
        const userUpdated=await StaffMemberModel.findByIdAndUpdate(req.user.id,{password:hashedPassword})
        //const userUpdated2=await StaffMemberModel.findById(req.user.id)
        // console.log(userUpdated.password)
      return  res.json("Password updated successfully.")
        }
        catch(err){
            return res.json("An error occured. Please try again.")
        }
})
//USE MOMENT LIBRARY moment().utc().format('hh:mm:ss') 
router.put('/signin',authenticateToken,async(req,res)=>{
    var datetime = new Date();
    var check=false;
    const today=new moment().format('dddd')
    
    const SignIn=moment()
    var SignInTime=moment().format("HH:mm").toString()
    //(moment(currentTime).format("HH:mm"))
    var currentTime = moment();
   //console.log("SignIn= "+SignIn)
    const user=await StaffMemberModel.findById(req.user.id)
    //if there is objects in attendance array will check if today's date is present to update it
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
       var newSignins=[]
       var signinsTemp=[]
        var idx=-1;
        var attArr=new Array()
        for(var i=0;i<attendance.length;i++){

            var momentA =moment(attendance[i].date).format('YYYY-MM-DD');
            var momentB = currentTime.format('YYYY-MM-DD');
            console.log("momentA= "+momentA)
            console.log("momentB= "+momentB)

            //checking if today's date and this object's date are the same and if user is signedOut 
            //
            if(momentA==momentB &&attendance[i].signedOut==true ){
                if(today=="Friday"){
                    var dayOffBool=true
                }
                else
                var dayOffBool=false

                console.log("herer")
                console.log("dayOfBool at singin "+dayOffBool)
                date=attendance[i].date
                time=attendance[i].time
                 hours=attendance[i].hours
                 minutes=attendance[i].minutes
                 last_signIn =SignIn
                 last_signOut=attendance[i].last_signOut
                 day=attendance[i].day
                check=true;
                idx=i;
              
                // newSigninsTemp=attendance[i].signins
               console.log("------------------------------------="+attendance[i])
               //console.log("000000000000000000000000000000000000="+newSignins)
            //    newSigninsTemp[attendance[i].signins.length]=SignInTime
            // //    console.log("1111111111111111111111111111111111111="+newSignins[0])
            // //    console.log("2222222222222222222222222222222222222="+newSignins[1])
            //    newSignins=newSigninsTemp
            //     console.log("SIGNINNNNNNNNNNNNNNNNNNNNNNN= "+newSignins)
                //const signins=
                
            }
            else if(momentA==momentB &&attendance[i].signedOut==false )
                return res.send("This user is already signed in.")
            attArr[i]=attendance[i];

        }
        //found today's record will update it then insert it into attendance array
        if(check===true){
            // console.log("SIGNINSSSSSSSSSSS INSIDEEEEE=" +signins)
            const newAtt={
                date:date,
                time:time,
                hours:hours,
                minutes:minutes,
                signedIn:true,
                signedOut:false,
                last_signIn:last_signIn,
                last_signOut:last_signOut,
                last_calculated_signOut:last_signIn,
                day:day,
                dayOffBool:dayOffBool,
                // signins:newSignins
            }
            console.log("SIGNINNNNNNNNNNNNNNNNNNNNNNN= "+newAtt)
            attArr[idx]=newAtt
            
            const up=await StaffMemberModel.findByIdAndUpdate(req.user.id,{attendance:attArr})
            console.log("uppppppppppppppppp= "+up)
            const user= await StaffMemberModel.findById(req.user.id)
            const att=user.attendance[idx].last_signIn
            const dateToday=user.attendance[idx].date
            const signedInToday=user.attendance[idx].signedIn
            const hour=user.attendance[idx].hours
            const minute=user.attendance[idx].minutes
            const dayoff=user.attendance[idx].dayOffBool
          //  console.log("signed in true= "+signedInToday)
        //     return res.json({name:user.name,date:(moment(dateToday).format("YYYY-MM-DD")),last_signIn:(moment(att).format("HH:mm")),
        //    hours:hour,minutes:minute,signins:up.attendance})
           return res.json("Succesfully signed in")
        }
    }
    //if didn't find today's date or array empty from the beginnning
    //will create a new record and insert it
    //using dayOffBool to check in signout because if signed in and out on friday will not count hours
    if(check===false || user.attendance.length==0){
        const newSignInDate=new moment()
       // moment.utc( //).format('YYYY-MM-DD');
           // console.log("new date= "+newSignInDate)
           if(today=="Friday"){
               var dayOffBool=true
           }
           else
           var dayOffBool=false
        //    console.log("at 2nd"+signins)
           console.log("dayofBool at signin= "+dayOffBool)
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
                day,
                dayOffBool:dayOffBool
                // signins:[SignInTime]
            })
            console.log("SignIn= "+SignIn)
            console.log("newAttendance "+newAttendance)
            //enter new record to already existing attendance array
        if(check===false){
           const attArr=user.attendance
           attArr[attArr.length]=newAttendance
           const update=await StaffMemberModel.findByIdAndUpdate(req.user.id,{attendance:attArr})
            const userNow= await StaffMemberModel.findById(req.user.id)
            const dateToday=userNow.attendance[attendance.length-1].date
            const att=userNow.attendance[attendance.length-1].last_signIn
            const signedInToday=userNow.attendance[attendance.length-1].signedIn
            console.log("att= "+(moment(att).format("HH:mm")))
            // return res.json({name:userNow.name,date:(moment(dateToday).format("YYYY-MM-DD")),
            // last_signIn:(moment(att).format("HH:mm")),signins:[SigninTime]
            // })
           return res.json("Succesfully signed in")
        }
        //enter new array with new record
        else{
           const attArr=new Array()
           attArr[0]=newAttendance
           console.log(attendance)
           const update=await StaffMemberModel.findByIdAndUpdate(req.user.id,{attendance:attArr})
           const user= await StaffMemberModel.findById(req.user.id)
           const att=user.attendance[0].last_signIn
           const dateToday=user.attendance[0].date
           const signedInToday=user.attendance[0].signedIn
        //    return res.json({name:user.name,date:(moment(dateToday).format("YYYY-MM-DD")),
        //    last_signIn:(moment(att).format("HH:mm")),signins:signins})
           return res.json("Succesfully signed in.")
        }
        

    }
    return res.json("An error occured. Please try again.")
    
})

router.put('/signout',authenticateToken,async(req,res)=>{
    var datetime = new moment();
    var check=false;
    const SignOut=moment()
    var currentTime = moment();
    const user=await StaffMemberModel.findById(req.user.id)
   var day_off=""
    if(user.staff_type=="HR")
    day_off=(await HRModel.findOne({member:req.user.id})).day_off
    else
    day_off=(await AcademicStaffModel.findOne({member:req.user.id})).day_off
    
 //  console.log("req.user.id= "+req.user.id)
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
        var OldSignIn=new moment().format("HH:mm")
        //searching for a record with this date to check if previously signed in
        for(var i=0;i<attendance.length;i++){
            var momentA = moment(attendance[i].date).format('YYYY-MM-DD');
            var momentB = currentTime.format('YYYY-MM-DD')
           // console.log("understand "+ attendance[i].last_signIn )
           //searching for today's date and signedout is false otherwise will say
           //already signed out
            if(momentA==momentB && attendance[i].last_signIn && attendance[i].signedOut==false ){
                var dayOffBool=attendance[i].dayOffBool
                console.log(attendance[i])
                console.log("dayofBool at signout= "+dayOffBool)
                OldSignIn=attendance[i].last_signIn
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
                    // const check1=((start.isBefore(end))==true)
                    // const check2=dayOffBool
                    // console.log("check1= "+check1)
                    // console.log("check2= "+check2)

                    //checking if today is not friday
                    //if it is will not add hours to monthly hours
                    //and checking if we signed in before 7 pm
                    //because after we will not add any hours
                    if((start.isBefore(end))==true && dayOffBool==false){
                    console.log("new start= "+moment(start).format("HH:mm"))
                    console.log("new end= "+moment(end).format("HH:mm"))
                    var minutes = end.diff(start, 'minutes');
                    var interval = moment().hour(0).minute(minutes);
                    var hrs=moment.duration(interval.format("HH:mm")).get('hours')
                    var minute=moment.duration(interval.format("HH:mm")).get('minutes')
                    // var Hrs=hrs-8
                    // var Min=minute-24
                    }
                    else{
                        var hrs=0
                        var minute=0 
                        // var Hrs=0
                        // var Min=0
                    }

                   


                    var fin=minute+attendance[i].minutes
                    var finH=hrs+attendance[i].hours
                    console.log("attendance[i].signedIn= "+attendance[i].signedIn)
                    if(attendance[i].miuntes+minutes>60){
                        console.log("signedin true")
                        hrs=hrs+1
                        finH++
                        fin=minute+attendance[i].minutes-60
                    }

                    var Hrs=finH-8
                    var Min=fin-24
                    console.log("extraHrs= "+Hrs)
                    console.log("extraMin= "+Min)
                    var extraHrs=0;
                    var extraMin=0
                    var missingHrs=0
                    var missingMin=0

                    if(Hrs<0)
                    missingHrs=-Hrs
                    else
                    extraHrs=Hrs
                    if(Min<0)
                    missingMin=-Min
                    else
                   extraMin=Min
                   if(extraMin>0 && missingHrs>0){
                    missingHrs--
                    missingMin=60-extraMin
                    extraMin=0
                    console.log("her paleeeeease")
                    console.log("missingHrs= "+missingHrs+" missingMin= "+missingMin)
                }
                if(extraHrs>0 && missingMin>0){
                   extraHrs--
                    extraMin=60-missingMin
                    missingMin=0
                    console.log("extraHrs= "+extraHrs+" extraMin= "+extraMin+" missingMin= "+missingMin)
                }



                   // console.log("herer")
                    date=attendance[i].date
                    time=attendance[i].time
                    hours=hrs+attendance[i].hours
                    minutes=fin
                    signedIn=false
                    last_signIn =attendance[i].last_signIn
                   // console.log(moment(last_signIn).format("HH:mm"))
                    last_signOut=SignOut
                    //console.log("check signout= "+moment(last_signOut).format("HH:mm"))
                    day=attendance[i].day
                    check=true;
                    idx=i;
                
            }
             else if(momentA==momentB && attendance[i].last_signIn && attendance[i].signedOut==true )
                 return res.send("This user has already signed out.")

            attArr[i]=attendance[i];

        }
        
        //found today's date and not signed out yet
        // will update monthly hrs,min
        //wil update the record with new missing hrs,min
        if(check==true){
            const user= await StaffMemberModel.findById(req.user.id)
            /////////////////////////////////////////////////////////////////////////////
           //we can signout so get extra and missing hours and minutes and add them
            var currMonth=new moment().format("M")
            var currYear=new moment().format("Y")

            //new MILESTONE2!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            // const currDay=new moment().format("D")
            // if(currDay<=10){
            //     if(Integer.parseInt(currMonth)==1){
            //         currMonth=12
            //         currYear=Integer.parseInt(currYear)-1;
            //     }
            //     else
            //         currMonth=Integer.parseInt(currMonth)-1;

            // }



            var c=false;
            var newMonthlyArr=new Array()

            //search in months hours for this person then add new hours 
            //and minutes if there is already a record
            
            console.log("length= "+user.time_attended.length)
            const check=(user.time_attended.length>0)
            console.log("check= "+check)
            if(user.time_attended.length>0){
                console.log("inside first if")
                for(var l=0;l<user.time_attended.length;l++){
                    if(user.time_attended[l].num==currMonth && user.time_attended[l].yearNum==currYear){
                        console.log("inside if")
                        
                        
                        console.log("before ifs "+"missingHrs= "+missingHrs+" missingMin= "+missingMin)
                        console.log("before ifs "+"extraHrs= "+extraHrs+" extraMin= "+extraMin+" missingMin= "+missingMin)
                       
                       
                        
                        var finEM=extraMin
                        var finMM=missingMin
                        var finEH=extraHrs
                        var finMH=missingHrs
                        
                        console.log("finEM= "+finEM)
                     console.log("inEH= "+finEH)
                       // console.log("extras= "+finEM+" "+finEH)

                        //new monthlyTime with updated hours and minutes
                        const newMonthly={
                            num:user.time_attended[l].num
                           ,yearNum:currYear
                            ,extraHours:finEH
                            ,extraMinutes:finEM
                             ,missingHours:finMH
                             ,missingMinutes:finMM
                        }
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
                const newMonthly= {
                    num:parseInt(currMonth)
                    ,yearNum:parseInt(currYear)
                    ,extraHours:extraHrs
                    ,extraMinutes:extraMin
                     ,missingHours:missingHrs
                     ,missingMinutes:missingMin
                }
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



            //updating attendance to enter signed out date
            ///////////////////////////////////////////////////////////////////////////////////
            const newAtt={
                date:date,
                time:time,
                attended:true,
                hours:hours,
                minutes:minutes,
                attended:true,
                signedIn:false,
                signedOut:true,
                last_signIn:last_signIn,
                last_signOut:SignOut,
                day:day
            }
            console.log("signout down= "+moment(SignOut).format("HH:mm"))
            attArr[idx]=newAtt
            try{
            const up=await StaffMemberModel.findByIdAndUpdate(req.user.id,{attendance:attArr})
            
           // const user= await StaffMemberModel.findById(req.user.id)
            const signin=user.attendance[idx].last_signIn
            const signout=user.attendance[idx].last_signOut
            console.log("signing out at"+moment(SignOut).format("HH:mm"))
            const dateToday=user.attendance[idx].date
            const lastCal=user.attendance[idx].last_calculated_signOut
            // return res.json({name:user.name,date:(moment(dateToday).format("YYYY-MM-DD")),last_signIn:(moment(OldSignIn).format("HH:mm")),last_signOut:(moment(SignOut).format("HH:mm")),
            //     hours:hours,minutes:minutes,signedIn:signedIn})
                return res.json("Succesffuly signed out.")}
                catch{
                    return res.json("An error occured please try again.")
                }
        }
    }


    //no attendance or this day is not found so no prior signin
    if(check===false || user.attendance.length==0){
        return res.json("Cannot sign out without prior signin.")
    }

        
})
///////////////////MUST MAKE SURE THAT USER INPUTS NUMBERSSSSSSSSSSSSSSSSS/////////
router.get('/attendanceRecords',authenticateToken,async(req,res)=>{
    const user=await StaffMemberModel.findById(req.user.id)
   // if(user.attendance){
        const attendance=user.attendance
        const sorted=attendance.sort(compare)
        var month=false;
        if(req.body.month){
            month=true;
            if(!((req.body.month>0) && (req.body.month<13) ))
            return res.send("Please enter correct month.")
            if(req.body.month<=0 || req.body.month>=13)
                return res.send("Please enter correct month.")
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
            if(arr.length==0)
            return res.json("There are no attendance records to display.")
            else{
                var check=false
                for(var k=0;k<arr.length;k++){
                    if(moment(arr[k].date).format("YYYY-MM-DD")<=new moment().format("YYYY-MM-DD")){
                        console.log("aaaaaaaaaaaaaaa= "+moment(arr[k].date).format("YYYY-MM-DD"))
                    res.write("Date: "+moment(arr[k].date).format("YYYY-MM-DD")+"\n")
                    res.write("Attended: "+arr[k].attended+"\n")
                    // res.write("last_signIn: "+moment(arr[k].last_signIn).format("HH:mm")+"\n")
                    // res.write("last_signOut: "+moment(arr[k].last_signOut).format("HH:mm")+"\n")
                    res.write("Hours: "+arr[k].hours+"\n")
                    res.write("Minutes: "+arr[k].minutes+"\n")
                    res.write("\n")
                    check=true
                    }
                }
                if(check==false){
                    return res.json("There are no attendance records to display.")
                }
                res.end()
               // return res.json({attendance:arr})
            }
          
        }



//}
    else{
        return res.json("There are no attendance records to display.")
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
    var dateMonth=moment().format("M")
    const dateYear=moment().format("Y")
  const dateDay=moment().format("D")
 // const dateDay=2
        const user=await StaffMemberModel.findById(req.user.id)
        var day=""
        if(user.staff_type=="HR")
         day=(await HRModel.findOne({member:req.user.id})).day_off
        else
       day=(await AcademicStaffModel.findOne({member:req.user.id})).day_off

        const userAttendance=user.attendance
        var userDays=new Array()
        var missedDays=new Array()
        var idx=0;
        var k=0;
        var check=false;
        const day_off=day
        console.log("dayoff= "+day_off)
        var nextMonth=0;
        var nextYear=0;

        //to get curr month and next month and year according to today's date
        //if less than 10 then curr month=month-1 
        if( dateDay<=10){
            dateMonth=dateMonth-1
        }

        if(dateMonth==12){
            nextMonth=1
            nextYear=(parseInt(dateYear)+1) 
        }
         else{
         nextMonth=(parseInt(dateMonth)+1)  
         nextYear=dateYear
        }
        console.log("dateMonth= "+dateMonth+" dateYear= "+dateYear+" nextYear= "+nextYear+" nextMonth= "+nextMonth)
        //first get list of present days in both months
        for(var i=0;i<userAttendance.length;i++){
            const currDay=userAttendance[i]
            const year=moment(currDay.date).format("Y")
            const month=moment(currDay.date).format("M")
            
            const dayNum=moment(currDay.date).format("D")
            const day=moment(currDay.date).format("dddd")
          //  console.log("in first")
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
        for(var l=0;l<sortedUserDays.length;l++){
      console.log(" sortedUserDays"+moment(sortedUserDays[l].date).format("YYYY-MM-DD"))
        }
        var j=0
        var currDay=11
        if(sortedUserDays.length>0)
        var m= moment(sortedUserDays[j].date).format('M')

        //start looping on days of first month to get missing days in between present days
        while(j<sortedUserDays.length && m==dateMonth){
            var d= moment(sortedUserDays[j].date).format('D')
            console.log("d=================="+d)
             m= moment(sortedUserDays[j].date).format('M')
                while(d>currDay && m==dateMonth ){
                   const currYear=new moment().format("Y")
                   var currDate=new moment(currYear+"-"+dateMonth+"-"+currDay).format('dddd')
                   console.log("currDay= "+currDay+" currDate= "+currDate+" d="+d)
                   if(currDate!=day_off && currDate!='Friday' ){
                       missedDays[k++]=new moment(currYear+"-"+dateMonth+"-"+currDay).format("YYYY-MM-DD");
                        console.log("adding "+missedDays[k-1])
                    }
                   currDay++
                }
                currDay++
                console.log("currDyyyyyyyyyyyyyyyyyyyyyyyyy= "+currDay)
                ++j
                if(j<sortedUserDays.length){
                 m= moment(sortedUserDays[j].date).format('M')

        }
        }
    if(j>0){
    var lastD= moment(sortedUserDays[j-1].date).format('D')
    var lastDName= moment(sortedUserDays[j-1].date).format('dddd')           
    var lastMonth=moment(sortedUserDays[j-1].date).format('M')
    var lastYear=moment(sortedUserDays[j-1].date).format('Y')
    console.log("ld= "+lastD+" lm= "+lastMonth+" ly= "+lastYear)
    var lastDay=parseInt(lastD)+1
    const y=moment(sortedUserDays[j-1].date).format("YYYY")
    const m=moment(sortedUserDays[j-1].date).format("MM")
    const d=moment(sortedUserDays[j-1].date).format("DD")
     lastDName=new moment(y+"-"+m+"-"+lastDay).format('dddd')
     console.log("lastdNAMEEEEEEEEEEEEEEE=" +lastDName)
    }
    else{
        var lastD= new moment(dateYear+"-"+dateMonth+"-"+currDay).format('D')
    var lastDName=new moment(dateYear+"-"+dateMonth+"-"+currDay).format('dddd')          
    const lastMonth=new moment(dateYear+"-"+dateMonth+"-"+currDay).format('M')
    var lastYear=new moment(dateYear+"-"+dateMonth+"-"+currDay).format('Y')
    console.log("ld= "+lastD+" lm= "+lastMonth+" ly= "+lastYear)
    var lastDay=parseInt(lastD)
    }
    //console.log("missed till now= "+missedDays)
    //get last day present from 1st month then fill the rest according to each month's number of days
    if(dateMonth==1 ||dateMonth==3 ||dateMonth==5 ||dateMonth==7 ||dateMonth==8 ||dateMonth==10||dateMonth==12){
        while(lastDay<32){
            //added recently
            var currDate=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format('dddd')
            console.log("lastYear= "+lastYear+" dateMonth"+dateMonth)
            console.log("here at "+lastDay+" lastDName= "+lastDName)
            if(lastDName!='Friday' && lastDName!=day_off ){
                
            missedDays[k++]=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("YYYY-MM-DD");
            console.log("added= "+missedDays[k-1])
            }
           lastDay++
           lastDName=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("dddd");
           console.log("now= "+lastDay)
        }
    }
    if(dateMonth==4 ||dateMonth==6 ||dateMonth==9 ||dateMonth==11 ){
        while(lastDay<31 ){
            //added recently
            var currDate=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format('dddd')
            if(lastDName!='Friday' && lastDName!=day_off ){
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
                 //added recently
            var currDate=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format('dddd')
             if(lastDName!='Friday'&& lastDName!=day_off ){
              missedDays[k++]=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("YYYY-MM-DD");
            }
            lastDay++;
            lastDName=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("dddd");
        }
        }
        else {
            while(lastDay<29){
                 //added recently
            var currDate=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format('dddd')
                if(lastDName!='Friday'&& lastDName!=day_off ){
            missedDays[k++]=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("YYYY-MM-DD");
                }
            lastDay++;
            lastDName=new moment(lastYear+"-"+dateMonth+"-"+lastDay).format("dddd");
        }
    }
    }
    //if only present in first month then fill 2nd month manually
    if( sortedUserDays.length==0||moment(sortedUserDays[sortedUserDays.length-1].date).format("M")==dateMonth ){
        var currDay2=1
        console.log("HEREEEEEEEEEEEEEEEEEEEEEEEEEEEE")
        lastDName=new moment(nextYear+"-"+nextMonth+"-"+currDay2).format("dddd");
        for(var g=1;g<=10;g++){
            //added recently
            var currDate=new moment(nextYear+"-"+nextMonth+"-"+currDay2).format('dddd')
            if(lastDName!='Friday'&& lastDName!=day_off ){
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
               //RECENTLY
                const currDate2=new moment(nextYear+"-"+nextMonth+"-"+currDay2).format('dddd')
                console.log("inside 2nd= "+currDay2+" "+currDate2)
                //RECENTLY
                if(currDate2!=day_off && currDate2!='Friday' ){
                    console.log("accepted 2nd= "+currDay2+" "+currDate2)
                    missedDays[k++]=new moment(nextYear+"-"+nextMonth+"-"+currDay2).format("YYYY-MM-DD");
                }
                currDay2++
                last2day=currDay2
                console.log("currDay2== "+currDay2+" d2="+d2)
             }
             
             currDay2++
             j++
            
     }
    //  console.log("missed till now= "+missedDays)
     //then start looping from last present day till the 10th of 2nd month
    //  var last2D=moment(sortedUserDays[sortedUserDays.length-1].date).format("D")
    //  var last2day=parseInt(last2D)+1
    var last2D=moment(sortedUserDays[sortedUserDays.length-1].date).format("D")
     var last2day=parseInt(last2D)+1
     console.log("LASTTTTTTTTTTTTTTTTTT= "+last2day)
    
     for(last2day;last2day<=10;last2day++){
        lastDName=new moment(nextYear+"-"+nextMonth+"-"+last2day).format("dddd");
        //RECENTLY
        const currDate2=new moment(nextYear+"-"+nextMonth+"-"+last2day).format('dddd')
         if(lastDName!='Friday' && lastDName!=day_off ){
             console.log("ADDDDDDDDDDDDDDDING= "+last2day)
        missedDays[k++]=new moment(nextYear+"-"+nextMonth+"-"+last2day).format("YYYY-MM-DD");
         }
        
     }
    }
    var returnArr=new Array()
    var s=0
    for(var d=0;d<missedDays.length;d++){
        if(moment(missedDays[d]).format("YYYY-MM-DD")< new moment().format("YYYY-MM-DD"))
        returnArr[s++]=missedDays[d]
    }
        return res.json(returnArr)
})

router.get('/missingHours',authenticateToken,async(req,res)=>{
        const user=await StaffMemberModel.findById(req.user.id)
        const monthly=user.time_attended
        var month=new moment().format('M')
        var year=new moment().format('Y')
        const day=new moment().format('D')

        //new Milestone2!!!!!!!!!!!!!!!!!!!!!!!!!!
        if(day<=10){
            if(month==1){
                month=12
                year=Integer.parseInt(year)-1
            }
            else
            month=Integer.parseInt(month)-1
        }

        var check=false;
        if(user.time_attended.length>0){
            for(var i=0;i<monthly.length;i++){
                if(monthly[i].num==month && monthly[i].yearNum==year){
                    check=true;
                    return res.json({missingHours:monthly[i].missingHours,
                        missingMinutes:monthly[i].missingMinutes,
                    extraHours:monthly[i].extraHours,extraMinutes:monthly[i].extraMinutes})
                }
            }
        }  
      else {
            // if(day>=11){
            
            // }
            // else if(day<=10){

            // }
            
            const newMonthly=new monthlyHoursSchema({
                num:month,
                yearNum:year
               , extraHours:0
                ,extraMinutes:0
                 ,missingHours:0,
                 missingMinutes:0
            })
            if(check==false && monthly.length==0){
            const arr=new Array()
            arr[0]=newMonthly
           
        }
            else {
                const arr=monthly
                arr[arr.length-1]=newMonthly
                
            }
            const userUp=await StaffMemberModel.findByIdAndUpdate(req.user.id,{time_attended:arr})
            res.json({missingHours:0,
                missingMinutes:0,
            extraHours:0,extraMinutes:0})
        }  
})
    


function calculateHrs(dateMonth,day_off){
    console.log("inside cal= "+dateMonth)
    console.log("inside "+day_off)
    var start=11
    var end=0;
    var hours=0;
    var minutes=0;
    if(dateMonth==1 ||dateMonth==3 ||dateMonth==5 ||dateMonth==7 ||dateMonth==8 ||dateMonth==10||dateMonth==12)
        end=31
    if(dateMonth==4 ||dateMonth==6 ||dateMonth==9 ||dateMonth==11 )
    end=30
    if(dateMonth==2 ){
        if(moment(dateYear).isLeapYear())
        end=29
        else
        end=28
    }
    const currYear=new moment().format("Y")
    for(var i=11;i<=end;i++){
       var currDay= new moment(currYear+"-"+dateMonth+"-"+i).format("dddd");
       if(currDay!= day_off && currDay!="Friday"){
            hours+=8
            if(minutes+24>60){
                hours++
                minutes=(minutes+24)-60
            }
       }
    }

    for(var j=1;j<=10;j++){
        var currDay= new moment(currYear+"-"+dateMonth+"-"+j).format("dddd");
        if(currDay!= day_off && currDay!="Friday"){
             hours+=8
             if(minutes+24>60){
                 hours++
                 minutes=(minutes+24)-60
             }
        }
     }
     console.log("inside "+hours+' m='+minutes)
     return {hours,minutes}
}


module.exports=router;