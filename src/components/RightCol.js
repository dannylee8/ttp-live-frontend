import React, { Component } from 'react';
import axios from 'axios'

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
    fetch(`http://localhost:3001/users/${userID}`, {
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
    fetch(`http://localhost:3001/stocks`, {
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
      this.props.updateStocks(json.stock, latestPrice)
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
        if (newBalance > 0 ) {
          this.setState({
            ticker: '',
            quantity: ''
          })
          this.placeOrder(this.props.user.id, newBalance, ticker, quantity, response.data.latestPrice)
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
      alert('Please enter a valid stock ticker symbol')
    })
  };

  render() {
    // console.log(this.props)
    const {ticker, quantity} = this.state
    return (
      // Portfolio mode, show right column bg color and dividing line
      <div className={`column ${(this.props.modeStatus === 'portfolio') ? 'right' : ''}`}>
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
