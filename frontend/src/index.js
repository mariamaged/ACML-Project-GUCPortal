import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {createStore} from 'redux'
import rootReducer from './reducers/rootReducer'
import setAuthorizationToken from './components/setAuthorizationToken'
import "bootswatch/dist/minty/bootstrap.min.css";
const store=createStore(rootReducer)
setAuthorizationToken(localStorage.jwtToken)


ReactDOM.render(
  <div>
    <App />
    </div>,
  document.getElementById('root')
);


