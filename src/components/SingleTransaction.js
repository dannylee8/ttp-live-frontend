import React from 'react'

function SingleTransaction (props) {
  return (
    <tr>
      <td>
        BUY ({props.symbol})
      </td>
      <td>
        {props.shares} shares @ ${parseFloat(props.price).toFixed(2)}
      </td>
    </tr>
  )
}

export default SingleTransaction
