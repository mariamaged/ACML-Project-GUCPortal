import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import rootReducer from './reducers/rootReducer'
import setAuthorizationToken from './components/setAuthorizationToken'

const store=createStore(rootReducer)
setAuthorizationToken(localStorage.jwtToken)

ReactDOM.render(
  <Provider store={store}>
    <App />
</Provider>,
  document.getElementById('root')
);


