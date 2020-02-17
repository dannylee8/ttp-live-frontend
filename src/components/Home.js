import React, { Component } from 'react';
import TopMenu from './TopMenu'
import LeftCol from './LeftCol'
import RightCol from './RightCol'

class Home extends Component {

  componentDidUpdate() {
    return this.props.loggedInStatus ? null : this.redirect()
  }

  redirect = () => {
    this.props.history.push('/login')
  }

  render() {
    return (
      <div>
        <TopMenu {...this.props} setMode={this.props.setMode} loggedInStatus={this.props.loggedInStatus} />
        {this.props.loggedInStatus ? 
          <div className='row'>
            <LeftCol {...this.props} userobj={this.props.userobj} modeStatus={this.props.modeStatus} />
            <RightCol {...this.props} updateUser={this.props.updateUser} userobj={this.props.userobj} modeStatus={this.props.modeStatus} />
          </div>
          : null}
      </div>
    )
  }
}

export default Home
