import logo from './logo.svg';
// import './App.css';
import ViewRequests from './components/ViewRequests'
import Login from './components/Login.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Router,Route,Switch} from 'react-router-dom'

import SubmittedRequests from './components/submittedRequests'
import ReceivedRequests from './components/receivedRequests'



import history from './history';
import getRequest from './components/getRequest'
import CallGetRequests from  './components/callGetRequests'
import CallGetReceivedRequests from  './components/callGetReceivedRequests'
import GetRequestsForms from './components/getRequestsForms'
import RequestsForms from './components/requestsForms'
import Notifications from './components/notifications'
// import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <Router history={history}>
    <div className="App">

    <Route exact path='/getRequestsForms' component={GetRequestsForms}/>
    <Route exact path='/requestsForms' component={RequestsForms}/>
    
    <Route exact path='/callGetReceivedRequests' component={CallGetReceivedRequests}/>
    <Route exact path='/callGetRequests' component={CallGetRequests}/>
        <Route exact path='/submittedRequests' component={SubmittedRequests}/>
        <Route exact path='/receivedRequests' component={ReceivedRequests}/>
        <Route exact path='/login' component ={Login}/>
        <Route exact path='/getRequest' component ={getRequest}/>
        <Route exact path='/ViewRequests' component ={ViewRequests}/>

       
       

        
    </div>
    </Router>
  );
}

export default App;