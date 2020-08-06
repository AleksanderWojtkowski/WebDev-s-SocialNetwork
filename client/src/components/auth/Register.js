import React,{Fragment,useState} from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import { Link, Redirect } from 'react-router-dom';
import {setAlert} from '../../actions/alert';
import {register} from '../../actions/auth'
import PropTypes from 'prop-types'


function Register({setAlert,register,isAuthenticated}) {
    const[formData,setFormData]=useState({
        name:'',
        email:'',
        password:'',
        password2:''
    });

    const {name,email,password,password2} = formData
    const onChange = e => {
       setFormData({
           ...formData,
           [e.target.name] : e.target.value
       })
    }
    const onSubmit = async e => {
        e.preventDefault();
        if(password !== password2){
            setAlert('password not valid','danger',2000)
        }else{
           register({
             name,
             email,
             password
           });
        }
    }
    if(isAuthenticated){
      return <Redirect to='/dashboard'/>
    }

    return (
        <Fragment>
          <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input 
          onChange={onChange}
          value={name}
          type="text" 
          placeholder="Name" 
          name="name" 
          required />
        </div>
        <div className="form-group">
          <input 
           onChange={onChange}
           value={email}
          type="email" 
          placeholder="Email Address" 
          name="email" />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small>
        </div>
        <div className="form-group">
          <input
           onChange={onChange}
           value={password}
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
           onChange={onChange}
           value={password2}
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
          />
        </div>
        <input 
        type="submit" 
        className="btn btn-primary" 
        value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
        </Fragment>
    )
};

Register.propTypes = {
  setAlert:PropTypes.func.isRequired,
  register:PropTypes.func.isRequired,
  isAuthenticated:PropTypes.bool,
}
const mapStateToProps = state => ({
  isAuthenticated:state.auth.isAuthenticated
 })
export default connect(mapStateToProps,{setAlert,register})(Register)
