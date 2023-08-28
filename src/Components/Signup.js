import React from 'react'
import { useState ,useEffect} from 'react'
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import  MenuItem  from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Snackbar from '@mui/material/Snackbar';

const SignUp = () => {
  // const baseUrl='http://localhost:8000';
     const baseUrl="https://writeverse-blogs.onrender.com";



  const mystyle={
    
      border:'16px solid #f3f3f3',
      borderRadius: '50%',
      borderTop: '16px solid blue',
      borderBottom: '16px solid blue',
      width: '120px',
      height: '120px',
  
  }
  const[data,setData]=useState({
    email:"",
    name:"",
    // phNum:"",
    // gender:"",
    password:"",
    // confirmPassword:"",
    // isConfirmPassword:false,
  })
  const[loading,setLoading]=useState(false);
  const [isSnackbarMsg,setIsSnackbarMsg]=useState('');
  const[isSnackbar,setIsSnackBar]=useState(false);
  const[errors,setErrors]=useState({
    emailError:"",
    nameError:"",
    // phNumError:"",
    // genderError:"",  
    passErr:"",
    // confirmPasswordErr:"",
    // isConfirmPasswordErr:"",
  })
  useEffect(() => {
    if (isSnackbar) {
      const timeout = setTimeout(() =>  setIsSnackBar(false), 5000);//means after 5s disappers
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isSnackbar]);

  
  useEffect(()=>{
    const timeout = setTimeout(() =>  setLoading(false), 5000);//means after 5s disappers
    return () => {
      clearTimeout(timeout);
    };
  },[loading])

  const validateEmail=()=>{
    if(data.email==null || data.email==""){
      setErrors((prev)=>({...prev,emailError:"Email can't be empty"}));
    }
    else{
    const emailRegex=/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    console.log("emailvalidation is>>",emailRegex.test(String(data.email).toLowerCase()));
    if(emailRegex.test(String(data.email).toLowerCase())){
      setErrors((prev)=>({...prev,emailError:""}));
    }
    else{
      setErrors((prev)=>({...prev,emailError:"Email validation failed!"}));
    }
    }
    
      }

  const validateName=()=>{
    console.log("name==''  isl>>",data.name=="")
   
if(data.name==""){
  setErrors((prev)=>({...prev,nameError:"Name cannot be empty"}));
}
else{
  setErrors((prev)=>({...prev,nameError:""}));
}
}

const validatePassword=()=>{
  console.log("bool is>>",data.confirmPassword==="" || data.password==="")
  if( data.password===""){
    setErrors((prev)=>({...prev,passErr:"Password can't be empty",}))
    
  }
  
  }
  
  const onSubmit=(e)=>{
    e.preventDefault();
   
    validateName();
    validateEmail();
    validatePassword();
    
    
   if(errors.passErr==""&&errors.emailError==""&&errors.nameError==""){
    console.log("iside this")
    handleSignup();
  }
}

  const handleSignup=async()=>{
  try{
    
    var url=baseUrl+'/signup';
    console.log({url});
    const signUpData={
      Name:data.name,
      email:data.email,
      password:data.password,
    }
    const resp=await fetch(url,{
      method:'POST',
      headers:{
        'Content-type':'application/json',
      },
      body:JSON.stringify(signUpData),
    })
    const response=await resp.json();
    console.log("reposneis>>",response);
    if(response.Status=='Success'){
      setIsSnackBar(true);
      setIsSnackbarMsg("Signup Successfull!!. Please Login!")
    }

    if(response.Status=='Error'){
      setIsSnackBar(true);
      setIsSnackbarMsg("Some error occurred! Please refresh Page and retry");
    }
    if (response.Status=="User exists"){
      setIsSnackBar(true);
      setIsSnackbarMsg("User already exists! Please go to login Page");

    }

  
  }
    catch(e){
      console.log("error in signup api",e)
    }
  }
  const handleChange=(e)=>{
setData((prev)=>({...prev,[e.target.name]:e.target.value}))

  }
  return (
    <div>
      <div>
      <TextField
      id="standard-basic" 
      label="Name" 
      name="name"
      value={data.name}
      variant="standard"
      onChange={(e)=>{handleChange(e)}}
      />
      {errors.nameError!==""?(<p style={{color:'red'}}>{errors.nameError}</p>):(null)}
      </div>
    
      <div>
      <TextField
      id="standard-basic" 
      label="Email Id" 
      name="email"
      value={data.email}
      variant="standard"
      onChange={(e)=>{handleChange(e)}}
      />
      {errors.emailError!==""?(<p style={{color:'red'}}>{errors.emailError}</p>):(null)}
      </div>
     
      <div>
        <div>
        <TextField
        id="standard-basic"
        label="password"
        name="password"
        type="password"
        value={data.password}
        variant="standard"
       
        onChange={(e)=>{handleChange(e)}}
        />
        </div>
      <div>
        {errors.passErr!==""?(<p style={{color:'red'}}>{errors.passErr}</p>):(null)}
        </div>
      </div>
    
<Button disabled={data.name==""||data.email==""||data.password==""} onClick={(e)=>{onSubmit(e)}}>Signup</Button>

<Button style={{backgroundColor:'pink',marginLeft:'5px'}} onClick={()=>{window.location.href='/login'}}>Login</Button>

{console.log("data is>>",data,"erroros>>",errors)}
<Snackbar
 sx={{ vertical: 'bottom',
 horizontal: 'left'}}
  open={isSnackbar}
  message={isSnackbarMsg}
/>
    </div>
  )
}




export default SignUp



