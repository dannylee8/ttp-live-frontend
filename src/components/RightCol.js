import React, { Component } from 'react';
import axios from 'axios'

// facilitate comma-separated numbers, eg: 8,888
var commaNumber = require('comma-number')

const HEADERS = {
  "content-type": "application/json",
  "accept"      : "application/json"
}

class RightCol extends Component {
  constructor (props) {
    super(props);
    this.state = { 
      ticker: '',
      quantity: ''
    };
  }

  handleChange = (event) => {
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  };

  placeOrder(userID, newBalance, ticker, quantity, latestPrice) {
    // create our new stock instance and assign it current user
    fetch(`https://ttp-live-backend.herokuapp.com/stocks`, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({
        symbol: ticker.toUpperCase(),
        shares: quantity,
        price: latestPrice,
        user_id: userID
      })
    })
    .then(resp => resp.json())
    .then(json => {
      // update our current user's cash balance
      fetch(`https://ttp-live-backend.herokuapp.com/users/${userID}`, {
        method: "PATCH",
        headers: HEADERS,
        body: JSON.stringify({
          cash: newBalance
        })
      })
      .then(resp => resp.json())
      .then(json => {
        this.props.updateUser(json.user)
      })
      // update our stocks array in App.js state
      // this.props.updateStocks(json.stock, latestPrice)
      // instead get the stocks from the server API
      this.props.getUserStocks(userID)
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const {ticker, quantity} = this.state

    // check for completed form inputs
    if (!ticker) {
      alert("Please enter a valid stock ticker symbol.")
      return
    }
    // positive, integers only
    if (!quantity || !Number.isInteger(Number(quantity)) || quantity < 0) {
      alert("Please enter quantity of shares")
      return
    }

    axios.get(`https://sandbox.iexapis.com/stable/stock/${ticker}/quote?token=Tpk_f60d00f3b3774527b14ddc2510d54b18`)
    .then(response => {
      if (response.data.symbol) {
        let orderCost = (response.data.latestPrice * quantity).toFixed(2)
        let newBalance = this.props.user.cash - orderCost

        // make sure User has enough cash to cover purchase
        if (newBalance > 0 ) {
          // Had these two lines reversed, so state was getting reset before the order was sent out
          this.placeOrder(this.props.user.id, newBalance, ticker, quantity, response.data.latestPrice)
          this.setState({
            ticker: '',
            quantity: ''
          })
        } else {
          alert("Insufficient funds")
          return
        }
      } else {
        this.setState({
          errors: 'no such ticker',
          ticker: '',
          quantity: ''
        })
      }
    })
    .catch(error => {
      console.log('api errors:', error)
      // clear state in the case we have an invalid ticker symbol
      this.setState({
        ticker: '',
        quantity: ''
      })
      alert('Please enter a valid stock ticker symbol')
    })
  };

  render() {
    // console.log(this.props)
    const {ticker, quantity} = this.state
    return (
      // Portfolio mode, show right column bg color and dividing line
      <div className={`column ${(this.props.modeStatus === 'portfolio' && this.props.loading) ? 'right fade-out' 
        : this.props.modeStatus === 'portfolio' ? 'right' 
        : ''}`}>
        {this.props.modeStatus === 'portfolio' ? 
        <>
          <div className="cash-balance">
            Cash Balance: $ {this.props.userobj ? `${commaNumber(parseFloat(this.props.userobj.cash).toFixed(2))}` : null}
          </div>
          <br />
          <div>
            <form className="w3-container stock-form" onSubmit={this.handleSubmit}>
              <input
                placeholder="Ticker symbol"
                className="w3-input w3-border w3-light-grey"
                type="text"
                name="ticker"
                value={ticker}
                onChange={this.handleChange}
              />
              <br />
              <input
                  placeholder="Quantity"
                  className="w3-input w3-border w3-light-grey"
                  type="text"
                  name="quantity"
                  value={quantity}
                  onChange={this.handleChange}
              />
              <br />
              <button className="w3-btn w3-round-large w3-blue-grey" placeholder="submit" type="submit">
                Buy
              </button>
            </form>
          </div>
        </>
        : null}
      </div>
    )
  }
}

export default RightCol;
