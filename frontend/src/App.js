import './App.css';
import Login from "./Components/Login";
import React from "react";
import {BrowserRouter,Route} from "react-router-dom";


import HR from "./Components/HR"
import Assisant from "./Components/Assistant"
import Instructor from "./Components/Instructor";

class App extends React.Component {

  render (){
    return (
      <BrowserRouter>
         <Route exact path="/" component={Login}/>
         
         <Route path="/hr" component={HR} />
         <Route path='/instructor' component={Instructor}/>
         <Route path='/assistant' component={Assisant}/>
      </BrowserRouter>

      )
  }
}

export default App;
