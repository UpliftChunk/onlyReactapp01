import './RemovedUsers.css'
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
function RemovedUsers() {
  // mystyle
  let mystyle= {position:"absolute", textShadow: "1px 1px 3px black"};

  // users state
  let [users, setUsers]= useState([]);
  // restoreUser state
  let [restoringUser, setRestoringUser]= useState();

  // modal state
  let [show, setShow] = useState(false);
  let showModal = ()=>setShow(true);
  let closeModal = ()=>setShow(false);

  // http req error state
  let [err, setError] = useState(undefined);

  let axiosError = (error)=> {
    // request couldnt be sent due to invalid request url or offline client
    setError(error.message);
    if(error.response){
      console.log("Client side error is ",error);
    }
    // client received the response but the request never left: the object is not put into db due to network error
    else if(error.request){
      console.log("Request Error Message is", error);
    }
    // other errors
    else{

    }
  }
  useEffect(()=>{
    FetchDeletedUsersData();
  },[])
  
  let FetchDeletedUsersData= ()=>{
      axios.get('http://localhost:4000/discardedUsers')
      .then( response=>{
        if(response.status===200)
          setUsers(response.data);
      })
      .catch(error => axiosError(error))
    }

  // confirm user
  let MakeSure = (userObj) => {
    showModal();
    setRestoringUser(userObj);
  }
  let restoreUser = () => {
    closeModal();
    
    axios.post(`http://localhost:4000/currentUsers`,restoringUser)
    .then((response) => {
      if (response.status){
        console.log(restoringUser.name," Added to users");
        FetchDeletedUsersData();
      }
    })
    .catch(error => axiosError(error))
    // make HTTP delete request to delete user
    axios.delete(`http://localhost:4000/discardedUsers/${restoringUser.id}`)
    .then(response => {
      if(response.status){
        console.log("success");
      }
    })
    .catch (error => axiosError(error));
  }


  return (
    <div className='border border-info m-2 p-2'>
      RemovedUsers
      {/* HTTP err message*/}
      {
      err!==undefined && 
      <div className='fs-5 text-center'>
       Error message: '  
       <span className='fw-bold text-danger text-decoration-underline font-monospace'>
        {err}
       </span>
       '
      </div>
      }
      
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 text-black g-4 m-3">
        {
          users.map(userObj=>
            <div className="col mx-auto">
              <div className="card card1 mb-2" >
                <div className="card-header">
                   {userObj.email} 
                </div> 
                <div className="card-body p-0">
                  <div className="p-2 row  justify-content-between g-1 text-white w-100" style={mystyle}>
                    <div className='col-6' style={{fontSize:"small"}}>
                    {userObj.dob} 
                    </div> 
                    <div className='text-end col-6'>
                      {userObj.name}
                    </div>
                  </div> 
                  <img className="userPhoto" src={userObj.Image} alt='Card ImageTop'/>
                </div>
                
                  <Button className="btn btn-warning rounded-0 float-end" onClick={()=>MakeSure(userObj)}>
                    Restore
                  </Button>

              </div> 
            </div>)
        }
      </div>
        {/* Modal to confirm restoration of user */}
        <Modal show={show}  backdrop="static" centered>
          <Modal.Header className='fs-6'>
            <Modal.Title>Restore Profile</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div> Are you sure want to add this user to Current Users again?</div>
            <Button type='submit' className='btn btn-secondary mt-3 float-start' onClick={()=>closeModal()}>Close</Button>
            <Button type='submit' className='btn add-user-btn mt-3 float-end' onClick={()=>restoreUser()}>Restore</Button>
          </Modal.Body>
        </Modal>
    </div>
  )
}

export default RemovedUsers