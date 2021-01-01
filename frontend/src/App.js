import logo from './logo.svg';
import './App.css';
import ViewRequests from './components/ViewRequests'
import Login from './components/Login.js'
import Test2 from './components/test2'
import ViewAcceptedRequests from './components/ViewAcceptedRequests'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ViewRequests/>
      </header>
    </div>
  );
}

export default App;
