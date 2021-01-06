import logo from './logo.svg';
// import './App.css';
import ViewRequests from './components/ViewRequests'
import Login from './components/Login.js'
//all requests
// import ViewAcceptedRequests from './components/ViewAcceptedRequests'
// // import ViewRejectedRequests from './components/ViewRejectedRequests'
// import ViewPendingRequests from './components/ViewPendingRequests'
//sick requests
import ViewSickRequests from './components/ViewSickRequests'
import ViewAcceptedSickRequests from './components/ViewAcceptedSickRequests'
import ViewRejectedSickRequests from './components/ViewRejectedSickRequests'
import ViewPendingSickRequests from './components/ViewPendingSickRequests'
//maternity request
import ViewMaternityRequests from './components/ViewMaternityRequests'
import ViewAcceptedMaternityRequests from './components/ViewAcceptedMaternityRequests'
import ViewRejectedMaternityRequests from './components/ViewRejectedMaternityRequests'
import ViewPendingMaternityRequests from './components/ViewPendingMaternityRequests'
//change day off request
import ViewChangeRequests from './components/ViewChangeRequests'
import ViewAcceptedChangeRequests from './components/ViewAcceptedChangeRequests'
import ViewRejectedChangeRequests from './components/ViewRejectedChangeRequests'
import ViewPendingChangeRequests from './components/ViewPendingChangeRequests'
//compensation request
import ViewCompensationRequests from './components/ViewCompensationRequests'
import ViewAcceptedCompensationRequests from './components/ViewAcceptedCompensationRequests'
import ViewRejectedCompensationRequests from './components/ViewRejectedCompensationRequests'
import ViewPendingCompensationRequests from './components/ViewPendingCompensationRequests'
//sent replacement request
import ViewReplacementRequests from './components/ViewReplacementRequests'
import ViewAcceptedReplacementRequests from './components/ViewAcceptedReplacementRequests'
import ViewRejectedReplacementRequests from './components/ViewRejectedReplacementRequests'
import ViewPendingReplacementRequests from './components/ViewPendingReplacementRequests'
//received replacement request
import ViewReceivedReplacementRequests from './components/ViewReceivedReplacementRequests'

//slot linking request
import ViewSlotLinkingRequests from './components/ViewSlotLinkingRequests'
import ViewAcceptedSlotLinkingRequests from './components/ViewAcceptedSlotLinkingRequests'
import ViewRejectedSlotLinkingRequests from './components/ViewRejectedSlotLinkingRequests'
import ViewPendingSlotLinkingRequests from './components/ViewPendingSlotLinkingRequests'

//received requests for hod
//received replacement request
import ViewReceivedSickRequests from './components/ViewReceivedSickRequests'
import ViewReceivedMaternityRequests from './components/ViewReceivedMaternityRequests'
import ViewReceivedChangeRequests from './components/ViewReceivedChangeRequests'
import ViewReceivedSlotLinkingRequests from './components/ViewReceivedSlotLinkingRequests'
import ViewReceivedCompensationRequests from './components/ViewReceivedCompensationRequests'

//sentList
import SentList from './components/sentList'
//all requests
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter,Router,Route,Switch} from 'react-router-dom'

import history from './history';
import getRequest from './components/getRequest'

function App() {
  return (
    <Router history={history}>
    <div className="App">
    <Route exact path="/sent" component={SentList}/>
    {/* <Route exact path='/maternityTable' component ={MaternityTable}/> */}
        <Route exact path='/login' component ={Login}/>
        <Route exact path='/getRequest' component ={getRequest}/>
        <Route exact path='/' component ={ViewRequests}/>

        <Route exact path='/ViewSickRequests' component ={ViewSickRequests}/>
        <Route exact path='/ViewAcceptedSickRequests' component ={ViewAcceptedSickRequests}/>
        <Route exact path='/ViewRejectedSickRequests' component ={ViewRejectedSickRequests}/>
        <Route exact path='/ViewPendingSickRequests' component ={ViewPendingSickRequests}/>

        <Route exact path='/ViewMaternityRequests' component ={ViewMaternityRequests}/>
        <Route exact path='/ViewAcceptedMaternityRequests' component ={ViewAcceptedMaternityRequests}/>
        <Route exact path='/ViewRejectedMaternityRequests' component ={ViewRejectedMaternityRequests}/>
        <Route exact path='/ViewPendingMaternityRequests' component ={ViewPendingMaternityRequests}/>

        <Route exact path='/ViewCompensationRequests' component ={ViewCompensationRequests}/>
        <Route exact path='/ViewAcceptedCompensationRequests' component ={ViewAcceptedCompensationRequests}/>
        <Route exact path='/ViewRejectedCompensationRequests' component ={ViewRejectedCompensationRequests}/>
        <Route exact path='/ViewPendingCompensationRequests' component ={ViewPendingCompensationRequests}/>

        <Route exact path='/ViewChangeRequests' component ={ViewChangeRequests}/>
        <Route exact path='/ViewAcceptedChangeRequests' component ={ViewAcceptedChangeRequests}/>
        <Route exact path='/ViewRejectedChangeRequests' component ={ViewRejectedChangeRequests}/>
        <Route exact path='/ViewPendingChangeRequests' component ={ViewPendingChangeRequests}/>

        <Route exact path='/ViewReplacementRequests' component ={ViewReplacementRequests}/>
        <Route exact path='/ViewAcceptedReplacementRequests' component ={ViewAcceptedReplacementRequests}/>
        <Route exact path='/ViewRejectedReplacementRequests' component ={ViewRejectedReplacementRequests}/>
        <Route exact path='/ViewPendingReplacementRequests' component ={ViewPendingReplacementRequests}/>

        <Route exact path='/ViewReceivedReplacementRequests' component ={ViewReceivedReplacementRequests}/>
       

        <Route exact path='/ViewSlotLinkingRequests' component ={ViewSlotLinkingRequests}/>
        <Route exact path='/ViewAcceptedSlotLinkingRequests' component ={ViewAcceptedSlotLinkingRequests}/>
        <Route exact path='/ViewRejectedSlotLinkingRequests' component ={ViewRejectedSlotLinkingRequests}/>
        <Route exact path='/ViewPendingSlotLinkingRequests' component ={ViewPendingSlotLinkingRequests}/>


        <Route exact path='/ViewReceivedSickRequests' component ={ViewReceivedSickRequests}/>
        <Route exact path='/ViewReceivedCompensationRequests' component ={ViewReceivedCompensationRequests}/>
        <Route exact path='/ViewReceivedSlotLinkingRequests' component ={ViewReceivedSlotLinkingRequests}/>
        <Route exact path='/ViewReceivedChangeRequests' component ={ViewReceivedChangeRequests}/>
        <Route exact path='/ViewReceivedMaternityRequests' component ={ViewReceivedMaternityRequests}/>
       
       

        
    </div>
    </Router>
  );
}

export default App;