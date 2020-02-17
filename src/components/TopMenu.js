import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function TopMenu (props) {
  const handleClick = () => {
    axios.delete('http://localhost:3001/logout', { withCredentials: true })
      .then(response => {
        props.handleLogout()
        props.history.push('/login')
      })
      .catch(error => console.log(error))
  }

  const setModeClick = (event) => {
    props.setMode(event.target.innerHTML.toLowerCase())
  }

  return (
    <div className='w3-bar top-menu'>
      {/* {console.log("TopMenu: ", props)} */}
      <span className='logo'>TTP Stock Trade</span>
      {props.loggedInStatus
        ?    
        <>       
          <Link to='/logout' onClick={handleClick}>
            <button className="w3-bar-item w3-button w3-pale-blue w3-right w3-hover-pale-red"><span className='glyphicon glyphicon-log-out' /> Log Out</button>
          </Link>
          <button onClick={setModeClick} className="w3-bar-item w3-button w3-light-grey w3-right w3-hover-pale-red">Portfolio</button>
          <button onClick={setModeClick} className="w3-bar-item w3-button w3-sand w3-right w3-hover-pale-red">Transactions</button>
        </>
        : null}
    </div>
  )
}

export default TopMenu
