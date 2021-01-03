// Our Components
import Login from './components/Login.js'
import ViewRejectedRequests from './components/ViewRejectedRequests.js'

// React Components
// React
import React from 'react'

// Reacter Router and axios
import { BrowserRouter, Route} from 'react-router-dom'
//import history from './history';

// CSS and images
import 'bootstrap/dist/css/bootstrap.min.css';

// Component
const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/" component={Login} />
        <Route path='/homepage' component={ViewRejectedRequests} />
      </div>
    </BrowserRouter>
  );
}

export default App;
