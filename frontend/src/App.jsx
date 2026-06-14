import React from 'react';

import{BrowserRouter as Router,Routes,Route} from "react-router-dom";
import {Signup} from "./pages/Signup";
import {Signin} from "./pages/Signin";
import {Dashboard} from "./pages/Dashboard";
import {Send} from "./pages/Send";
import {Navigate} from "react-router-dom";

function App() {

  return (
   <>
    <Router>
      <Routes>
        <Route path="/signup" element={<Navigate to="/signup" />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/send" element={<Send/>}/>
      </Routes>
    </Router>
   </>
  )
}

export default App
