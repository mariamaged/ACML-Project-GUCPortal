import logo from './logo.svg';
// import './App.css';
import ViewRequests from './components/ViewRequests'
import Login from './components/Login.js'
import Test from './components/newTest.js'
import ViewAcceptedRequests from './components/ViewAcceptedRequests'
import ViewRejectedRequests from './components/ViewRejectedRequests'
import ViewSickLeave from './components/ViewSickLeave'
// import  './css/test4.css'
// import  './css/test44.css'
// import  './css/lastTable.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Router,Route,Switch} from 'react-router-dom'

import history from './history';
import getRequest from './components/getRequest'

function App() {
  return (
    <Router history={history}>
    <div className="App">
      
        <Route exact path='/' component ={ViewRequests}/>
        <Route exact path='/ViewSickLeave' component ={ViewSickLeave}/>
        <Route exact path='/getRequest' component ={getRequest}/>
        <Route exact path="/ViewAcceptedRequests" component={ViewAcceptedRequests}/>
        <Route path='/ViewRejectedRequests' component={ViewRejectedRequests}/>
        {/* <Route path="/ViewAcceptedRequests" render={(props) => <ViewAcceptedRequests {...props}/>}/> */}
    </div>
    </Router>
  );
}

export default App;
