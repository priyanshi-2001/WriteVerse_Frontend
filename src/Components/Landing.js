import React from 'react'
import { useState,useEffect } from 'react';
import { Button, Modal ,Input} from '@mui/material';
import moment from 'moment'
import {Image, Video, Transformation,CloudinaryContext} from 'cloudinary-react';
import Snackbar from '@mui/material/Snackbar';
// const url="http://localhost:8000/";
const url="https://writeverse-blogs.onrender.com/";

const Landing = () => {
  const [data,setData]=useState([]);
  const[commentsData,setCommentsData]=useState([]);
  const[showLikesPopup,setShowLikesPopup]=useState(false);
  const[showCommentsPopup,setShowCommentsPopup]=useState(false);
  const[postId,setPostId]=useState('');
  const[likesData,setLikesData]=useState([]);
  const[newComment,setNewComment]=useState('');
  const [isSnackbarMsg,setIsSnackbarMsg]=useState('');
  const[isSnackbar,setIsSnackBar]=useState(false);
  useEffect(()=>{
    (async()=>{

      if(showLikesPopup){
      await getLikesData();
      }

    })()

  },[showLikesPopup])

  useEffect(() => {
    if (isSnackbar) {
      const timeout = setTimeout(() =>  setIsSnackBar(false), 5000);//means after 5s disappers
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isSnackbar]);

  useEffect(()=>{
    (async()=>{
      console.log("isndie useffcet postId is",postId)
      if(showCommentsPopup){
      await fetchComments();
      }

    })()

  },[showCommentsPopup])

  useEffect(()=>{

    (async()=>{
      await getData();

    })()

  },[])

  const addreaction=async()=>{
    const resp=await fetch(url+'addReaction',{
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${localStorage.getItem("token")}`

      },
      method:'POST',
      body:JSON.stringify({
        postId:postId,
        userId:localStorage.getItem("userId"),
        reaction:'L'

      })
    })
    const response=await resp.json()
    if(response.Error=='NA'){
      console.log("likesData is",likesData,"resp data is",response.Data);
      setLikesData(prevData => prevData.concat(response.Data));
    }
    if(response.Error=="Already Liked"){
      setIsSnackBar(true);
      setIsSnackbarMsg('Already Liked this Blog!!')

    }
    if(response.error=='Invalid token' || response.error=='Authentication required'){
      window.location='/login';
     }
  }
  const addComments=async()=>{
    const resp=await fetch(url+'addComment',{
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${localStorage.getItem("token")}`

      },
      method:'POST',
      body:JSON.stringify({
        postId:postId,
        userId:localStorage.getItem("userId"),
        description:newComment

      })
    })
    const response=await resp.json()
    if(response.Error=='NA'){
     setCommentsData(prevData => prevData.concat(response.Data));
    }
    if(response.error=='Invalid token' || response.error=='Authentication required'){
      window.location='/login';
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

  const getLikesData=async()=>{
    const resp=await fetch(url+'getReactions/'+postId,{
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${localStorage.getItem("token")}`

      },
      method:'GET'
    })
    const response=await resp.json()
    if(response.Error=='NA'){
     setLikesData( response.Data);
    }
    if(response.error=='Invalid token' || response.error=='Authentication required'){
      window.location='/login';
     }
  }

  const fetchComments=async()=>{
    try{
      const resp=await fetch(url+'getComments/'+postId,{
        headers:{
          'Content-Type':'application/json',
          'Authorization':`Bearer ${localStorage.getItem("token")}`

        },
        method:'GET'
      })
      const response=await resp.json()
      if(response.Error=='NA'){
       setCommentsData( response.Data);
      }
      if(response.error=='Invalid token' || response.error=='Authentication required'){
        window.location='/login';
       }

    }
    catch(err){
      console.log("error is",err);
    }
  }

  return (
    <div>
      <Button onClick={()=>{window.location.href='/createBlog'}}>Create Post</Button>
      <Button onClick={()=>{window.localStorage.removeItem("token");window.localStorage.removeItem("userId");window.location='/login'}}>Logout</Button>
   
        <Modal
          open={showLikesPopup}
          onClose={() => {
            setPostId('');
            setShowLikesPopup(false);
          }}
        >
          <div style={{ backgroundColor: '#f0f0f0', width: '60%', maxWidth: '600px', margin: 'auto', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <h2 id="modal-title" style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>Likes</h2>
            <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px', borderRadius: '5px', backgroundColor: 'white', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)' }}>
              {likesData.map((o, index) => (
                <div key={index} style={{ color: '#333', marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginRight: '10px', width: '30px', height: '30px', backgroundColor: '#ddd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{o.userId && o.userId.Name.charAt(0)}</div>
                  <div>{o.userId && o.userId._id==localStorage.getItem("userId")?('You'):(
                    <div>{o.userId && o.userId.Name}</div>
                  )}
                  </div>
                  
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <Button onClick={() => { addreaction(); }} style={{ backgroundColor: '#333', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Like</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Button variant="contained" onClick={() => { setPostId(''); setShowLikesPopup(false); }} style={{ backgroundColor: '#aaa', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                Close Modal
              </Button>
            </div>
          </div>
        </Modal>



        <Modal
          open={showCommentsPopup}
          onClose={() => {
            setPostId('');
            setShowCommentsPopup(false);setNewComment('')
          }}
        >
          <div style={{ backgroundColor: '#f0f0f0', width: '60%', maxWidth: '600px', margin: 'auto', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <h2 id="modal-title" style={{ color: '#333', marginBottom: '20px', textAlign: 'center' }}>Comments</h2>
            <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px', borderRadius: '5px', backgroundColor: 'white', boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)' }}>
              {commentsData.map((o) => (
                <div key={o._id} style={{ color: '#333', marginBottom: '10px', padding: '8px', borderRadius: '5px', border: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                  <div style={{ marginRight: '10px', width: '30px', height: '30px', backgroundColor: '#ddd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>{o.userId && o.userId.Name.charAt(0)}</div>
                  <div>{o.userId && o.userId._id==localStorage.getItem("userId")?('You'):(
                    <div>{o.userId && o.userId.Name}</div> 
                  )}
                  </div>
                  &nbsp;&nbsp;&nbsp;
                  <div>{o.description}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Input type="text" value={newComment} onChange={(e)=>{setNewComment(e.target.value)}}/>

              <Button onClick={() => { addComments(); }} style={{ backgroundColor: '#333', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Comment</Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <Button variant="contained" onClick={() => { setPostId(''); setShowCommentsPopup(false);setNewComment('') }} style={{ backgroundColor: '#aaa', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                Close Modal
              </Button>
            </div>
          </div>
        </Modal>



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
        
        <p style={{ marginBottom: '10px' }}>{o.body}</p>
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
        <Button
          onClick={() => {
            setShowLikesPopup(true);
            setPostId(o._id);
          }}
          style={{ marginRight: '5px' }}
        >
          Like
        </Button>
        <Button
          onClick={() => {
            setShowCommentsPopup(true);
            setPostId(o._id);
          }}
        >
          Comment
        </Button>
      </div>
    );
  })
}

      {
        Array.from(data).length==0 && <div>
          No Data Found!
        </div>
      }
      <Snackbar
      sx={{ vertical: 'bottom',
      horizontal: 'left'}}
        open={isSnackbar}
        message={isSnackbarMsg}
      />

    </div>
  )
}

export default Landing

