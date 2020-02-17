import React from 'react'
import SingleStock from './SingleStock'
import SingleTransaction from './SingleTransaction'

var commaNumber = require('comma-number')

function LeftCol (props) {
  return (
    <div className='column left'>
      <br />
      <br />
      {props.modeStatus === 'portfolio' ? 
      <>
        <h2>Portfolio</h2>
        <h4>Current value: ${commaNumber(props.portfolioCurrentValue.toFixed(2))}</h4>
        <h4>Portfolio Cost: ${commaNumber(props.portfolioCost)}</h4>
        <table id='stocks'>
          <tbody>
            {props.stocks.map((s) => { 
              return <SingleStock key={s.id} symbol={s.symbol} shares={s.shares} currentPrice={s.current_price} openPrice={s.openPrice}/>
            })}
          </tbody>
        </table>
      </>
      : 
      <>
        <h2>Transactions</h2>
        <table id='stocks'>
          <tbody>
            {props.stocks.map((s) => { 
              return <SingleTransaction key={s.id} symbol={s.symbol} shares={s.shares} price={s.price} />
            })}
          </tbody>
        </table>
      </>
      }
    </div>
  )
}

export default LeftCol;