import './AddUser.css'
import React, {useState} from 'react'
import {useForm} from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddUser() {
  // navigate hook
  let navigate= useNavigate();
// user form hook
  let {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm();

// http req error state
let [err, setError] = useState(undefined);

  let addNewUser = (newUser) => {
    console.log(newUser);
    // save user to dbusers
    axios.post("http://localhost:4000/currentUsers", newUser)
    .then(response =>{
      setError(undefined);
      console.log(response);
      // navigate to curUsers component
      navigate("/users")
    })
    .catch(error => {
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
    })
  }


  return (
    <div className='border border-info m-2 p-2'>
      AddUser
      {/* HTTP err message*/}
      {err!==undefined && 
      <div className='fs-5 text-center'>
       Error message: '  
       <span className='fw-bold text-danger text-decoration-underline font-monospace'>
        {err}
       </span>
       '
       </div>}
      {/* responsive form */}
      <div className='row'>
        <div className='col-11 col-sm-8 col-md-6'>
          
          <form onSubmit={handleSubmit(addNewUser)}>
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
              <input type="text" id="Image" className='form-control  border-top-0  border-dark' {...register("Image")}/>
            </div>
            {/* Submit button */}
            <button type='submit' className='btn btn-info'>Add this user</button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default AddUser