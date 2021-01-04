// Our Components
import Login from './components/Login.js'
<<<<<<< HEAD
import ViewAcceptedRequests from './components/ViewAcceptedRequests'
import ViewRejectedRequests from './components/ViewRejectedRequests'
import ViewPendingRequests from './components/ViewPendingRequests'
import ViewSickLeave from './components/ViewSickLeave'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Router,Route,Switch} from 'react-router-dom'
=======
import ViewRejectedRequests from './components/ViewRejectedRequests.js'

// React Components
// React
import React from 'react'
>>>>>>> 03568c79dd7788f515027db788da44d222e2441c

// Reacter Router and axios
import { BrowserRouter, Route} from 'react-router-dom'
//import history from './history';

// CSS and images
import 'bootstrap/dist/css/bootstrap.min.css';

// Component
const App = () => {
  return (
<<<<<<< HEAD
    <Router history={history}>
    <div className="App">
      
        <Route exact path='/' component ={ViewRequests}/>
        <Route exact path='/ViewSickLeave' component ={ViewSickLeave}/>
        <Route exact path='/getRequest' component ={getRequest}/>
        <Route exact path="/ViewAcceptedRequests" component={ViewAcceptedRequests}/>
        <Route exact path="/ViewPendingRequests" component={ViewPendingRequests}/>
        <Route path='/ViewRejectedRequests' component={ViewRejectedRequests}/>
        {/* <Route path="/ViewAcceptedRequests" render={(props) => <ViewAcceptedRequests {...props}/>}/> */}
    </div>
    </Router>
=======
    <BrowserRouter>
      <div className="App">
        <Route exact path="/" component={Login} />
        <Route path='/homepage' component={ViewRejectedRequests} />
      </div>
    </BrowserRouter>
>>>>>>> 03568c79dd7788f515027db788da44d222e2441c
  );
}

export default App;
