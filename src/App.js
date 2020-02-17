import React, { Component } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom'
import axios from 'axios'
import Signup from './components/registrations/Signup'
import Login from './components/registrations/Login'
import Home from './components/Home'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isLoggedIn: false,
      loading: true, 
      mode: '',
      portfolioCost: 0,
      portfolioCurrentValue: 0,
      stocks: [],
      user: {}
    };
  }

  componentDidMount() {
    // check if user is already logged in
    this.loginStatus()
  }

  // portfolio or transactions mode?
  setMode = (modeText) => {
    this.setState({
      mode: modeText
    })
  }

  // update our state:user after order placed in RightCol.js
  updateUser = (user) => {
    this.setState({
      user: user
    })
  }

  // update our state:stocks after order placed in RightCol.js
  updateStocks = (stock, latestPrice) => {
    this.setState({
      stocks: [...this.state.stocks, { ...stock, current_price: latestPrice } ]
    })
  }

  // check if we're already logged into server
  loginStatus = () => {
    axios.get('https://ttp-live-backend.herokuapp.com/logged_in', {withCredentials: true})
    .then(response => {
      if (response.data.logged_in) {
        this.handleLogin(response.data)
      } else {
        this.handleLogout()
      }
    })
    .catch(error =>{
      console.log('api errors:', error)
    })
  }

  // set our state with user info and their stocks array
  handleLogin = (data) => {
    this.setState((prevState, props) => ({
      isLoggedIn: true,
      user: data.user, 
      mode: 'portfolio'
    }))
    if (data.user) {
      this.getUserStocks(data.user.id)
    }
  }

  // get current user's stocks array
  getUserStocks = (id) => {
    fetch(`https://ttp-live-backend.herokuapp.com/users/${id}`)
    .then (resp => resp.json())
    .then (json => {
      this.setState((prevState, props) => ({
        stocks: json.stocks,
        portfolioCost: json.portfolio_cost,
        portfolioCurrentValue: json.portfolio_current_value
      }))
      
      let symbolList = json.stocks.map(s => s.symbol).join(',')

      // call IEX API to get open/high/low/close data to use to conditionally render portfolio list's colors
      axios.get(`https://sandbox.iexapis.com/stable/stock/market/batch?symbols=${symbolList}&types=ohlc&token=Tpk_f60d00f3b3774527b14ddc2510d54b18`)
      .then(response => {
        // response contains OHLC data for each stock in our users portfolio

        for (var key in response.data) {
          // response.data[key].ohlc.open.price is the number we're looking for
          let k = key   // assigning k to key to clear 'no-loop-func' eslint 
          let stockInState = this.state.stocks.find(s => s.symbol === k) // stock obj we are iterating on
          let filteredState = this.state.stocks.filter(s => s.symbol !== k) // all others in the stocks array
          let openPrice = response.data[key].ohlc.open.price // the open price

          // set the state, using spread oeprator to add a new value to stock obj
          this.setState({
            stocks: [...filteredState, { ...stockInState, openPrice: openPrice  } ]
          })
        }
      })
    })
  }

  handleLogout = () => {
    this.setState({
      isLoggedIn: false,
      user: {}
    })
  }

  render() {
    return (
      <div id='wrapper'>
        <BrowserRouter>
          <Switch>
            <Route 
              exact path='/login' 
              render={props => (
              <Login {...props} handleLogin={this.handleLogin} loggedInStatus={this.state.isLoggedIn}/>
              )}
            />
            <Route 
              exact path='/signup' 
              render={props => (
              <Signup {...props} handleLogin={this.handleLogin} loggedInStatus={this.state.isLoggedIn}/>
              )}
            />
            <Route 
              path='/' 
              render={props => (
              <Home {...props} {...this.state} updateUser={this.updateUser} updateStocks={this.updateStocks} handleLogout={this.handleLogout} userobj={this.state.user} setMode={this.setMode} modeStatus={this.state.mode} loggedInStatus={this.state.isLoggedIn}/>
              )}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;