import React from 'react'
import{ Link} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import {logout} from '../../actions/auth'

function Navbar({logout,auth:{isAuthenticated, loading}}) {
   

    return (
        <nav className="navbar bg-dark">
        <h1>
          <a href="index.html"><i className="fas fa-code"></i> DevConnector</a>
        </h1>
        <ul>
          <li>
            <Link to='/dashboard'>Dashboard</Link>
          </li>
          <li><Link to="/">Developers</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li>
        <a onClick={logout} href='#!'>
          <i className='fas fa-sign-out-alt' />{' '}
          <span className='hide-sm'>Logout</span>
        </a>
      </li>
        </ul>
      </nav>
    )
}

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth:PropTypes.object,
}

const mapStateToProps = state => ({
  auth:state.auth
})

export default connect(mapStateToProps,{logout})(Navbar)
