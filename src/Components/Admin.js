import React from 'react'
import { useState,useEffect } from 'react';
import { Button, Modal ,Input, TextField,Link} from '@mui/material';
import moment from 'moment'
import {Image, Video, Transformation,CloudinaryContext} from 'cloudinary-react';
import Snackbar from '@mui/material/Snackbar';
import CreateBlog from './CreateBlog';
// const url="http://localhost:8000/";
const url="https://writeverse-blogs.onrender.com/";
const Admin = () => {

  const [data,setData]=useState([]);
  const[commentsData,setCommentsData]=useState([]);
  const[showPopup,setShowPopup]=useState(false);
  const [isSnackbarMsg,setIsSnackbarMsg]=useState('');
  const[isSnackbar,setIsSnackBar]=useState(false);
  const[blogId,setblogId]=useState('');
  const [videoBlobUrl,setVideoBlobUrl]=useState([]);
  const[base64String,setBase64String]=useState([]);
  const[blobPdfUrl, setBlobPdfUrl]=useState([]);
  const[imagesBlobUrl,setImagesBlobUrl]=useState([]);
  const[mappings,setMappings]=useState([]);
  const[showPreview,setPreview]=useState(false);
  const [files,setFiles]=useState([]);
  const[body,setBody]=useState('');

  useEffect(()=>{

    (async()=>{
      await getData();

    })()

  },[])


  const editBlog=async(description,currentFiles)=>{
    try{
      var formData=new FormData();
      for (let i = 0 ; i < files.length ; i++) {
          formData.append("files", files[i]);
      }
      if(body!==""){
      formData.append("description",body); 
      }
      else{
        formData.append("description",description); 
      }
      formData.append("currentFiles",currentFiles)
      formData.append("blogId",blogId); 
      const resp=await fetch(url+'updateBlog',{
        headers:{
          'Authorization':`Bearer ${localStorage.getItem("token")}`

        },
        method:'POST',
        body:formData
      })
      const response=await resp.json()
      if(response.Error=='NA'){
       window.location.reload();
      }
      if(response.error=='Invalid token' || response.error=='Authentication required'){
        window.location='/login';
       }
    }
    catch(err){
      console.log("err",err);
    }
  }

  const deleteBlog=async(blogId)=>{
    try{
      const resp=await fetch(url+'deleteBlog',{
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem("token")}`

        },
        method:'POST',
        body:JSON.stringify({
          blogId
        })
      })
      const response=await resp.json()
      if(response.Error=='NA'){
      //   const temp=[...data];
      //   const udpatedData=temp.filter((o)=>o._id!=blogId)
      //  setData(udpatedData);
      setData(data.filter(({ _id }) => _id !== blogId));
      }
      if(response.error=='Invalid token' || response.error=='Authentication required'){
        window.location='/login';
       }
    }
    catch(err){
      console.log("err",err);
    }
  }

  const getData=async()=>{
    try{
      const resp=await fetch(url+'fetchBlogs',{
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem("token")}`

        },
        method:'GET'
      })
      const response=await resp.json()
      if(response.Error=='NA'){
       setData( response.Data );
      }
      if(response.error=='Invalid token' || response.error=='Authentication required'){
        window.location='/login';
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

  return (
    <div>

     <Modal
          open={showPopup}
          onClose={() => {
            setShowPopup(false)
          }}
        >
           <div style={{width:'100%',height:'100%'}}>
          <CreateBlog data={data.filter((o)=>o._id==blogId)} />
          </div>
          
          </Modal>
      <Button onClick={()=>{window.location.href='/createBlog'}}>Create Post</Button>
      <Button onClick={()=>{window.localStorage.removeItem("token");window.localStorage.removeItem("userId");localStorage.removeItem("isIsAdmin");window.location='/login'}}>Logout</Button>

{
  data &&
  data.map((o) => {
    return (
      <div key={o._id} style={{ border: '1px solid #ccc', padding: '10px', margin: '25px', marginLeft:'20%',marginRight:'20%', borderRadius: '5px' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          {new Date(o.modifiedDate).getTime() === new Date(o.createdDate).getTime() ?(
            <>
            {moment.utc(o.createdDate).local().startOf('seconds').fromNow()}
            </>
          ):(
            <>
            Edited {moment.utc(o.modifiedDate).local().startOf('seconds').fromNow()}
            </>
          )} 
        </p>
        {o.userId && o.userId.Name && <div style={{ marginBottom: '5px' }}>
          {o.userId._id ==localStorage.getItem("userId")?('You'):(<div>{o.userId.Name}</div>)}
          </div>
        }
        
        <p style={{ marginBottom: '10px' }}><TextField defaultValue={o.body} value={body!=='' && blogId==o._id?body:o.body} onChange={(e)=>{setBody(e.target.value)}} disabled={blogId!=o._id} /></p>
        {o.files !== '' ? (
          <div>
            {JSON.parse(o.files).map((k) => {
              return (
                <div key={k}>
                  {k.substr(k.length - 3) === 'pdf' ? (
                    <div>
                      <div>
                        <div>
                          <embed src={k} height={450} width={450}></embed>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Image
                        cloudName={JSON.stringify(k).split('res.cloudinary.com')[1].split('/')[1]}
                        version={JSON.stringify(k).split('/v')[1].split('/')[0]}
                        publicId={'/Posts/' + JSON.stringify(k).split('/Posts/')[1].replace('"', '')}
                        style={{ transform: 'rotate(-45deg)'}}
                      >
                        <Transformation effect="trim" angle="45" crop="scale" width="400" />
                      </Image>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}

        {
          blogId==o._id?(
            <div>
              <div>
              <input type="file" multiple accept=".png" onChange={(e) => {handleFile(e)}} style={{marginTop: '10px'}}/>
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
          ):(null)
        }

        {blogId!=o._id?(
          <Button onClick={()=>{setblogId(o._id)}}> Edit</Button>
        ):(
          <>
          <Button onClick={()=>{setblogId('');setBlobPdfUrl([]);setImagesBlobUrl([]);setVideoBlobUrl([]);setBody('')}}> Cancel</Button>
          <Button onClick={()=>{editBlog(o.body,o.files)}}>Save Changes</Button>
          </>
        )}
        
        <Button onClick={()=>{deleteBlog(o._id)}}>Delete</Button>
       
      </div>
    );
  })
}
    </div>
  )
}

export default Admin

