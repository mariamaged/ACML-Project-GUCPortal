
///////////////////MUST MAKE SURE THAT USER INPUTS NUMBERSSSSSSSSSSSSSSSSS/////////
router.get("/attendanceRecords", authenticateToken, async (req, res) => {
  
    console.log(req.query.month);
    req.body.month=req.query.month;
    console.log(req.body.month)
    const user = await StaffMemberModel.findById(req.user.id);
    // if(user.attendance){
    const attendance = user.attendance;
    const sorted = attendance.sort(compare);
    var month = false;
    if (req.body.month) {
      month = true;
      if (!(req.body.month > 0 && req.body.month < 13))
        return res.status(400).send({msg:"Please enter correct month."});
      if (req.body.month <= 0 || req.body.month >= 13)
        return res.status(400).send({msg:"Please enter correct month."});
    }
  
    var arr = new Array();
    var idx = 0;
    if (user.attendance.length > 0) {
      for (var i = 0; i < user.attendance.length; i++) {
        const currDay = user.attendance[i];
        if (month) {
          const dateMonth = moment(currDay.date).format("M");
          // console.log("month= "+dateMonth)
          if (dateMonth == req.body.month)
            arr[idx++] = {
              date: moment(currDay.date).format("YYYY-MM-DD"),
              attended: currDay.attended,
              last_signIn: moment(currDay.last_signIn).format("HH:mm"),
              last_signOut: moment(currDay.last_signOut).format("HH:mm"),
              hours: currDay.hours,
              minutes: currDay.minutes,
            };
        } else
          arr[idx++] = {
            date: moment(currDay.date).format("YYYY-MM-DD"),
            attended: currDay.attended,
            last_signIn: moment(currDay.last_signIn).format("HH:mm"),
            last_signOut: moment(currDay.last_signOut).format("HH:mm"),
            hours: currDay.hours,
            minutes: currDay.minutes,
          };
      }
      if (arr.length == 0)
        return res.status(400).send({msg:"There are no attendance records to display."});
      else {
        var check = false;
        for (var k = 0; k < arr.length; k++) {
          if (
            moment(arr[k].date).format("YYYY-MM-DD") <=
            new moment().format("YYYY-MM-DD")
          ) {
            console.log(
              "aaaaaaaaaaaaaaa= " + moment(arr[k].date).format("YYYY-MM-DD")
            );
            res.write("Date: " + moment(arr[k].date).format("YYYY-MM-DD") + "\n");
            res.write("Attended: " + arr[k].attended + "\n");
            // res.write("last_signIn: "+moment(arr[k].last_signIn).format("HH:mm")+"\n")
            // res.write("last_signOut: "+moment(arr[k].last_signOut).format("HH:mm")+"\n")
            res.write("Hours: " + arr[k].hours + "\n");
            res.write("Minutes: " + arr[k].minutes + "\n");
            res.write("\n");
            check = true;
          }
        }
        if (check == false) {
          return res.status(400).send({msg:"There are no attendance records to display."});
        }
        res.end();
        // return res.json({attendance:arr})
      }
    }
  
    //}
    else {
      return res.status(400).send({msg:"There are no attendance records to display."});
    }
  });