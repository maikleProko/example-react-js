import './App.css';

import {Component} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import Login from './components/Login/Login.js';
import Admin from './components/Admin/Admin.js';
import User from './components/User/User.js';
import UserStock from "./components/UserStock/UserStock";
import UserSales from "./components/userSales/UserSales";

class App extends Component {
    render() {
      return (
          <div className="App">
          <header className="App-header">
              <p>Stock market</p>
          </header>
              <Router>
                  <div>
                      <Routes>
                          <Route path="/" element={<Login/>}/>
                          <Route path="/userPage" element={<User/>}/>
                          <Route path="/adminPage" element={<Admin/>}/>
                          <Route path="/user/:name/userStock" element={<UserStock/>}/>
                          <Route path="/user/:name/userSales" element={<UserSales/>}/>
                          <Route path="*" element={<p>Page not found</p>}/>
                      </Routes>
                  </div>
              </Router>
          </div>
      )
    };
}

export default App;
