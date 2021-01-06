//import bootstrap from './bootstrap.min.css'
import bootstrap from './Mintybootstrap.min.css'
import HR from './Components/HR'
import AddLocation from './Views/AddLocation'
import DeleteLocation from './Views/DeleteLocation'
import EditLocation from './Views/EditLocation'
import AddFaculty from './Views/AddFaculty'
import DeleteFaculty from './Views/DeleteFaculty'
import EditFaculty from './Views/EditFaculty'
import AddDepartment from './Views/AddDepartment'
import DeleteDepartment from './Views/DeleteDepartment'
import EditDepartment from './Views/EditDepartment'
import AddCourse from './Views/AddCourse'
import DeleteCourse from './Views/DeleteCourse'
import EditCourse from './Views/EditCourse'
import AddMember from './Views/AddMember'
import DeleteMember from './Views/DeleteMember'
import EditMember from './Views/EditMember'
import UpdateSalary from './Views/UpdateSalary'
import MemberAttendance from './Views/MemberAttendance'
import StaffMissingHours from './Views/StaffMissingHours'
import StaffMissingDays from './Views/StaffMissingDays'
import AddRecord from './Views/AddRecord'
//hoty el import dy 3and el component nafso b3d ma t-install it
import {useTransition, animated} from 'react-spring';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import Login from "./Components/Login";

function App() {
  return(
    <div>
      
      <Router>
      
        
        
      <Switch>
        <Route exact path="/" component={Login}/>
         <Route exact path='/HR'><HR name="Maya"/></Route>
         <Route path='/HR/AddLocation'><HR name="Maya"/><AddLocation/></Route>
         <Route path='/HR/DeleteLocation'><HR name="Maya"/><DeleteLocation/></Route>
         <Route path='/HR/EditLocation'><HR name="Maya"/><EditLocation/></Route>
         <Route path='/HR/AddFaculty'><HR name="Maya"/><AddFaculty/></Route>
         <Route path='/HR/DeleteFaculty'><HR name="Maya"/><DeleteFaculty/></Route>
         <Route path='/HR/EditFaculty'><HR name="Maya"/><EditFaculty/></Route>
         <Route path='/HR/AddDepartment'><HR name="Maya"/><AddDepartment/></Route>
         <Route path='/HR/DeleteDepartment'><HR name="Maya"/><DeleteDepartment/></Route>
         <Route path='/HR/EditDepartment'><HR name="Maya"/><EditDepartment/></Route>
         <Route path='/HR/AddCourse'><HR name="Maya"/><AddCourse/></Route>
         <Route path='/HR/DeleteCourse'><HR name="Maya"/><DeleteCourse/></Route>
         <Route path='/HR/EditCourse'><HR name="Maya"/><EditCourse/></Route>
         <Route path='/HR/AddMember'><HR name="Maya"/><AddMember/></Route>
         <Route path='/HR/DeleteMember'><HR name="Maya"/><DeleteMember/></Route>
         <Route path='/HR/EditMember'><HR name="Maya"/><EditMember/></Route>
         <Route path='/HR/UpdateSalary'><HR name="Maya"/><UpdateSalary/></Route>
         <Route path='/HR/ViewMemberAttendance'><HR name="Maya"/><MemberAttendance/></Route>
         <Route path='/HR/ViewStaffWithMissingHours'><HR name="Maya"/><StaffMissingHours/></Route>
         <Route path='/HR/ViewStaffWithMissingDays'><HR name="Maya"/><StaffMissingDays/></Route>
         <Route path='/HR/AddMissingRecord'><HR name="Maya"/><AddRecord/></Route>
      </Switch> 
     </Router> 
    </div>
   
  )
}


export default App;



// function App() {
//   return (
//     // <div className="App">
//     //   <header className="App-header">
//     //     <img src={logo} className="App-logo" alt="logo" />
//     //     <p>
//     //       Edit <code>src/App.js</code> and save to reload.
//     //     </p>
//     //     <a
//     //       className="App-link"
//     //       href="https://reactjs.org"
//     //       target="_blank"
//     //       rel="noopener noreferrer"
//     //     >
//     //       Learn React
//     //     </a>
//     //   </header>
//     // </div>
//      <div>
//        <Header/>
//          <HelloWorld name="maya"/>
         
//      </div>
//   );
// }