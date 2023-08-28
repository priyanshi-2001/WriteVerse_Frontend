import React from 'react'
import { useState,useEffect } from 'react'
import { TextField,Button } from '@mui/material'
// const url="http://localhost:8000/"
const url="https://writeverse-blogs.onrender.com/";


const Login = () => {
  const [email,setEmail]=useState('');
  const[password,setPassword]=useState('');
  const handleLogin=async()=>{
    try{
      const resp=await fetch(url+"login",{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          email,password
        })
      }
      
      )
      const res=await resp.json();
      if(res.Error==="Admin Login"){
        localStorage.setItem("token",res.token);
        localStorage.setItem("userId",res.userId);
        localStorage.setItem("isIsAdmin",true);
        
        window.location="/admin";
      }

      else if(res.Error=='NA'){
        localStorage.setItem("token",res.token);
        localStorage.setItem("userId",res.userId);
        window.location="/landing";
      }
     
      else{
        window.location="/signup";
      }



    }
    catch(err){
      console.log("err",err);
    }
  }

  return (
    <div style={{backgroundColor:'#60B9EA',

    marginLeft:'33%',marginRight:'33%',marginTop:'10px'
   }}>
      <div style={{ display:'flex',
      flexDirection:'column',
      alignItems:'center',backgroundColor:'#60B9EA'}}>
      <div >
            <div > Email </div>
            <div style={{marginRight:'80px'}}>
            <TextField
            placeholder='Email'
            name="email"
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}
            />
            </div>
      </div>
      <div>
          <div> Password</div>
          <div style={{marginRight:'80px'}}>
          <TextField
            placeholder='Password'
            name="password"
            type='password'
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
            />
          </div>
      </div>

     

      </div>

      <div style={{display:'flex',marginLeft:'150px'}}>
      <div>
        <Button style={{backgroundColor:'pink'}} disabled={email==''||password==''} onClick={()=>{handleLogin()}}>Login</Button>
      </div>
      <div><Button style={{backgroundColor:'pink',marginLeft:'5px'}} onClick={()=>{window.location.href='/signup'}}>Signup</Button></div>
      </div>

    </div>
  )
}

export default Login