import './CurUsers.css'
import React, {useState, useEffect} from 'react'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
function CurUsers() {
  // mystyle
  let mystyle= {position:"absolute", textShadow: "1px 1px 3px black"};

  // users state
  let [users, setUsers]= useState([]);
  // CurUser id state
  let [CurUser, setCurUser]= useState({});

  // modal state for edit
  let [showEdit, setShowEdit] = useState(false);
  let showModalEdit = ()=>setShowEdit(true);
  let closeModalEdit = ()=>setShowEdit(false);

  // modal state for delete
  let [showDelete, setShowDelete] = useState(false);
  let showModalDelete = ()=>setShowDelete(true);
  let closeModalDelete = ()=>setShowDelete(false);

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
  // user form hook
  let {
    register,
    formState: {errors},
    setValue,
    getValues
  } = useForm();


  // !side effect - get users data
  // useEffect(()=>{
  //   axios.get('http://localhost:4000/currentUsers')
  //   .then( response=>{
  //     if(response.status===200)
  //       setUsers(response.data);
  //   })
  //   .catch(error => {
  //     // request couldnt be sent due to invalid request url or offline client
  //     setError(error.message);
  //     if(error.response){
  //       console.log("Client side error is ",error);
  //     }
  //     // client received the response but the request never left: the object is not put into db due to network error
  //     else if(error.request){
  //       console.log("Request Error Message is", error);
  //     }
  //     // other errors
  //     else{

  //     }
  //   })
  // },[])

  // get users data
  
  useEffect(()=>{
    FetchUsersData();
  },[])
  
  let FetchUsersData= ()=>{
      axios.get('http://localhost:4000/currentUsers')
      .then( response=>{
        if(response.status===200)
          setUsers(response.data);
      })
      .catch(error => axiosError(error))
    }

  // edit user
  let editUser = (userObj) => {
    showModalEdit();
    // fill input fiels with user details
    setValue("name", userObj.name);
    setValue("email", userObj.email);
    setValue("dob", userObj.dob);
    setValue("Image", userObj.Image);
    setCurUser(userObj);
  }
  let saveUser = () => {
    closeModalEdit();
    // get modified user data
    let modifiedUser= getValues();
    modifiedUser.id = CurUser.id;
    // make HTTP Put request to save modified user
    axios.put(`http://localhost:4000/currentUsers/${modifiedUser.id}`,modifiedUser)
    .then((response) => {
      if (response.status){
        FetchUsersData();
      }
    })
    .catch(error => axiosError(error))
  }
  let MakeSureDelete = (userObj) => {
    showModalDelete();
    setCurUser(userObj);
  }
  let deleteUser =() =>{
    closeModalDelete();
    // post to removed users
    axios.post(`http://localhost:4000/discardedUsers`,CurUser)
    .then((response) => {
      if (response.status){
        console.log(CurUser.name," Added to discarded users");
        FetchUsersData();
      }
    })
    .catch(error => axiosError(error))
    // make HTTP delete request to delete user
    axios.delete(`http://localhost:4000/currentUsers/${CurUser.id}`)
    .then(response => {
      if(response.status){
        console.log("success");
      }
    })
    .catch (error => axiosError(error));
  }

  return (
    <div className='border border-info m-2 p-2'>
      CurUsers
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
                
                <div className="card-footer p-2 row  justify-content-between g-1">
                  <button className="btn btn-warning col-5 border-dark" onClick={()=>editUser(userObj)}>
                    Edit
                  </button>
                  <button className="btn btn-danger col-5 border-dark" onClick={()=>MakeSureDelete(userObj)}>
                    Delete
                  </button>
                </div>

              </div> 
            </div>)
        }
      </div>
        {/* Modal to edit user */}
        <Modal show={showEdit}  backdrop="static" centered>
          <Modal.Header>
            <Modal.Title>Edit Profile</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {/* form to edit */}
            <form>
            {/* name */}
            <div className="mb-3">
              <label className='text-end border-bottom border-dark w-100 mb-1' htmlFor='name'>Name</label>
              <input type="text" id="name" className='form-control  border-top-0  border-dark' {...register("name", {required: true})}/>
              {/* validation errors for name */}
              {errors.name?.type==="required" && <p className='text-danger'>*name is required</p>}
            </div>
            {/* email */}
            <div className="mb-3">
              <label className='text-end border-bottom border-dark w-100 mb-1' htmlFor='email'>Email</label>
              <input type="email" id="email" className='form-control  border-top-0  border-dark' {...register("email", {required: true})}/>
              {errors.email?.type==="required" && <p className='text-danger'>*email is required</p>}
            </div>
            {/* date of birth */}
            <div className="mb-3">
              <label className='text-end border-bottom border-dark w-100 mb-1' htmlFor='dob'>Date of birth</label>
              <input type="date" id="dob" className='form-control  border-top-0  border-dark' {...register("dob", {required: true})}/>
              {errors.dob?.type==="required" && <p className='text-danger'>*date of birth is required</p>}
            </div>
            {/* image url */}
            <div className="mb-3">
              <label className='text-end border-bottom border-dark w-100 mb-1' htmlFor='Image'>Profile photo</label>
              <input type="text" id="Image" className='form-control  border-top-0  border-dark' {...register("Image")} disabled/>
            </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button type='submit' className='btn add-user-btn' onClick={()=>saveUser()}>Save</Button>
          </Modal.Footer>
        </Modal>

        {/* Modal to confirm deletion of user */}
        <Modal show={showDelete}  backdrop="static" centered>
          <Modal.Header className='fs-6'>
            <Modal.Title>Delete Profile</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div> Are you sure you want to Delete the user: {CurUser.name} ?</div>
            <Button className='btn btn-secondary mt-3 float-start' onClick={()=>closeModalDelete()}>Close</Button>
            <Button type='submit' className='btn btn-danger mt-3 float-end' onClick={()=>deleteUser()}>Delete</Button>
          </Modal.Body>
        </Modal>
    </div>
  )
}

export default CurUsers