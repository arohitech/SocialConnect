import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './Auth/login/Login.jsx'
import Home from './pages/Home.jsx'
import Firstpage from './pages/Firstpage.jsx'
import Signup from './pages/Signup.jsx'
import MyProfile from './pages/MyProfile.jsx'
import Navbar from './Layouts/Navbar.jsx'
import Myconnections from './pages/Myconnections.jsx'
import Myposts from './pages/Myposts.jsx'
import Footer from './Layouts/Footer.jsx'
import Profile from './pages/Profile.jsx'
import UpdateProfile from './pages/Updateprofile.jsx'
import EditProfile from './pages/Updateprofile.jsx'
import AllUsers from './pages/People.jsx'
import Notifications from './pages/Notifications.jsx'



const App = () => {
  return (
    <div>
      
      <Routes>
        <Route path='/' element={<Firstpage />} />
        <Route path='/home' element={<><Navbar /><Home/><Footer/></>}/>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/myprofile' element={<><Navbar /><MyProfile /><Footer/></> } />
        <Route path='/myconnections' element={<><Navbar /><Myconnections /><Footer/></>} />
        <Route path='/myposts' element={<><Navbar /><Myposts /><Footer/></>} />
        <Route path='/profile/:id' element={<><Navbar /><Profile /><Footer/></>} />
        <Route path='/editprofile' element={<><Navbar /><EditProfile /><Footer/></>} />
        <Route path='/getallusers' element={<><Navbar /><AllUsers /><Footer /></>} />
        <Route path='/notifications' element={<><Navbar /><Notifications /><Footer /></>} />
        
       
      </Routes>
      
    </div>
  );
}

export default App
