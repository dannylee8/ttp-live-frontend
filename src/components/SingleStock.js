import React from 'react'
var commaNumber = require('comma-number')

function SingleStock (props) {
  // conditionally render color of the stock Symbol and Price 
  // red if current price is less than open price
  // green if reverse, gray if equal
  console.log(props)

  return (
    <tr>
      <td className={(props.currentPrice > props.openPrice) ? 'green' : (props.currentPrice === props.openPrice) ? 'gray' : 'red'}>
        {props.symbol}
      </td>
      <td>
        {props.shares} shares
      </td>
      <td className={(props.currentPrice > props.openPrice) ? 'green' : (props.currentPrice === props.openPrice) ? 'gray' : 'red'}>
        $ {commaNumber((props.shares * props.currentPrice).toFixed(2))}
      </td>
    </tr>
  )
}

export default SingleStock
