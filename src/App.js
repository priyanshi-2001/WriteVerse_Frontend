import React from 'react'
import Landing from './Components/Landing';
import Login from './Components/Login';
import Signup from './Components/Signup';
import Admin from './Components/Admin';
import CreateBlog from './Components/CreateBlog';
import { BrowserRouter, Route,Routes, Link } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
     <Route path="/" element={<Login/>}></Route>
     <Route path="/login" element={<Login/>}></Route>
     <Route path="/signup" element={<Signup/>}> </Route>
     <Route path="/landing" element={<Landing/>}> </Route>
     <Route path="/admin" element={<Admin/>}> </Route>
     {/* <Route path="/createBlog" element={<CreateBlog/>}> </Route> */}
     <Route path="/createBlog/:o?" element={<CreateBlog/>}> </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App