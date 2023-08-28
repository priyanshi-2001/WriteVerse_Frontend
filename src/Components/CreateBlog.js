import React from 'react'
import { useState,useEffect } from 'react';
import {Input,Button,TextField} from '@mui/material'
import {Image, Video, Transformation,CloudinaryContext} from 'cloudinary-react';
import { useLocation } from 'react-router-dom';

// const url="http://localhost:8000/";
const url="https://writeverse-blogs.onrender.com/";

const CreateBlog = () => {

  
  const [details,setDetails]=useState({
    body:'',
    userId:localStorage.getItem("userId")
    
})
const[base64String,setBase64String]=useState([]);
const[blobPdfUrl, setBlobPdfUrl]=useState([]);
const[imagesBlobUrl,setImagesBlobUrl]=useState([]);
const [videoBlobUrl,setVideoBlobUrl]=useState([]);


const[previewPdf,setPreviewPdf]=useState([]);
const[previewImages,setPreviewImages]=useState([]);
const[previewVideos,setPreviewVideos]=useState([]);

const[mappings,setMappings]=useState([]);

const[showPreview,setPreview]=useState(false);


const [files,setFiles]=useState([]);


const handleFile=async(e)=>{
    var temp=Array.prototype.slice.call(e.target.files);
    setFiles(temp);
    await showPreviewForFiles(temp);
        
        if(base64String!==[]){
            setPreview(true)
       }  
}

const showPreviewForFiles =async(temp)=>{
    var obj=[];
    var j=0;
    while(j<temp.length){
        obj.push(temp[j]);
        const base64Temp=await getBase64(temp[j]);   
       
       
        j++; 
    }
 
}

const conditionsPeview=async(base64Temp,file)=>{
        var tempBase64=[...base64String,base64Temp];
        setBase64String((prev)=>[...prev,base64Temp]);
        let temporaryarray = [...mappings];
        temporaryarray[mappings.length]={};
        temporaryarray[mappings.length]['name'] = file.name;
        temporaryarray[mappings.length]['value'] = base64Temp;
        setMappings(temporaryarray);
        if (base64Temp.startsWith("data:application/pdf;base64,")){
            
            setBlobPdfUrl((prev)=>[...prev,base64Temp]);
        }
        if(base64Temp.startsWith("data:image/png;base64,")){
          
            setImagesBlobUrl((prev)=>[...prev,base64Temp]);
        }
        if(base64Temp.startsWith("PCF")){
            
            setVideoBlobUrl((prev)=>[...prev,base64Temp]);
        }
    
}

const createPost=async()=>{
    try{
        var formData=new FormData();
        for (let i = 0 ; i < files.length ; i++) {
            formData.append("files", files[i]);
        }
        formData.append("body",details.body); 
        formData.append("userId",details.userId);
        const res=await fetch(url+"createBlog",{
        headers:{
            'Authorization':`Bearer ${localStorage.getItem("token")}`
        },
        method:'POST',
        body:formData
    })
    const resp=await res.json();
    if(resp.Error=='NA'){
       
        if(localStorage.getItem("isIsAdmin")){
          window.location.href='/admin';
        }
        else{
        window.location.href="/landing";   
        }    
    }


    }
    catch(err){
        console.log("err",err);
    }
}
  
const downloadFileObject=(base64String)=>{
    const linkSource = base64String;
    const downloadLink = document.createElement("a");
    var fileName;
    if(base64String.startsWith("data:application/pdf;base64,")){

    
     fileName = "FilePdf.pdf";
    }
    if(base64String.startsWith("data:image/png;base64,")){
        fileName='FileImage.png';
    }
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

const handleDeleteFiles=(val,a)=>{
    
    if(a==blobPdfUrl){
        setBlobPdfUrl(blobPdfUrl.filter((o)=>o!=val));
        setBase64String(base64String.filter((o)=>o!=val));
       
    }
    if(a==imagesBlobUrl){
        setImagesBlobUrl(imagesBlobUrl.filter((o)=>o!=val));
        setBase64String(base64String.filter((o)=>o!=val));
        
    }


}

const handleChange=(e)=>{

    setDetails((prev)=>({...prev,[e.target.name]:e.target.value}));
}

const getBase64=async(file) =>{
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload =async function () {
        
      await conditionsPeview(reader.result,file);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
 }



  return (
     
<div style={{backgroundColor:'',backgroundImage: "url('https://example.com/your-image.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
  <div style={{textAlign: 'center', marginBottom: '20px'}}>
    <div>
      {previewPdf.map((o, index) => {
        return (
          <div key={index} style={{marginBottom: '10px'}}>
            {o.name}&nbsp;&nbsp;{o.value}
          </div>
        )
      })}
    </div>
    <div>
      <TextField
        placeholder='Please enter Body of Blog'
        name='body'
        value={details.body}
        rows={20}
        multiline
        sx={{width:'600px'}}
        onChange={(e) => {handleChange(e)}}
        style={{width: '600px'}}
      />
    </div>
    <div>
      <input type="file" multiple accept=".png" onChange={(e) => {handleFile(e)}} style={{marginTop: '10px'}}/>
    </div>
    <div>
      <Button onClick={() => {createPost()}} style={{marginTop: '10px'}}>Add</Button>
    </div>

    {base64String.length > 0 && files.length > 0 && showPreview ? (
      <div style={{display: 'flex', flexDirection: 'row', gap: '60px', marginTop: '20px'}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '60px'}}>
          {blobPdfUrl.map((o, index) => {
            return (
              <div key={index}>
                <embed src={o} height={500} width={500} style={{marginBottom: '10px'}}/>
                <div>
                  <Button onClick={() => {downloadFileObject(o)}}>Download</Button>
                  <Button onClick={() => {handleDeleteFiles(o, blobPdfUrl)}}>Delete</Button>
                </div>
              </div>
            )
          })}
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: '60px'}}>
          {imagesBlobUrl.map((o, index) => {
            return (
              <div key={index}>
                <img src={o} height={500} width={500} alt="Red dot" style={{marginBottom: '10px'}}/>
                <div>
                  <Button onClick={() => {downloadFileObject(o)}}>Download</Button>
                  <Button onClick={() => {handleDeleteFiles(o, imagesBlobUrl)}}>Delete</Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    ) : (null)}


   

  </div>
</div>

  )
}

export default CreateBlog