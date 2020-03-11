

# Front and backend for TTP Stage 2 assessment
[https://drive.google.com/file/d/1Z9kbDmSzfGIvShJDzXQvpX68DAHfO0iS/view]

### Fullstack Assessment
#### Overview
For this assessment, you’ll need to implement a web-based stock portfolio app. For the purpose of this
exercise a stock is simply an asset that can be bought or sold (like a house) at a price that continuously
rises and falls throughout the day. Up to date pricing information is available for free via the IEX API or
the Alpha Vantage API, but feel free to use any API that you’re familiar with.
A guide to the UI can be observed below. Your implementation doesn’t need to be an exact match but
should implement all of the listed user stories. In addition to the user stories, your submission will be
assessed for readability, efficiency, and design choices made. All code submitted should be placed in a
public repository that can be shared and must contain a clear commit history.

#### Design & Style Guide

![Design-style-guide-sample](https://raw.githubusercontent.com/dannylee8/ttp/master/design-style-guide.png)

#### User Stories (6)
1. As a user, I want to create a new account with my name, email, and password so that I can buy and
trade stocks.
	  - Default the user’s cash account balance to $5000.00 USD.
	  - A user can only register once with any given email.
	  
2. As a user, I want to authenticate via email and password so that I can access my account.

4. As a user, I want to buy shares of stock at its current price by specifying its ticker symbol and the
number of shares so that I can invest.
	- A user can only buy whole number quantities of shares.
	- A user can only buy shares if they have enough cash in their account for a given purchase.
	- A user can only buy shares if the ticker symbol is valid.
	
5. As a user, I want to view a list of all transactions I’ve made to date (trades) so that I can perform an
audit.

6. As a user, I want to view my portfolio (a list of all the stocks I own along with their current values) so
that I can review performance.
	- Current values should be based on the latest price and quantity owned for a given stock.
	- Each stock owned should only appear once.
	
7. As a user, I’d like to see the font color of stock symbols and current prices in my portfolio change
dynamically to indicate performance.
	- Display red when the current price is less than the day’s open price.
	- Display grey when the current price is equal to the day’s open price.
	- Display green when the current price is greater than the day’s open price.

-----
## Technology Stack

### Ruby on Rails backend as API/Server
	- ruby 2.6.1
	- rails 6.0.2
	- postgresql 1.2.2
	- bcrypt 3.1.13 - authentication/login
	- active_model_serializers 0.10.10
	- iex-ruby-client 1.1.0

### Javascript and React frontend
	- react 16.12.0
	- react router 5.1.2
	- axios 0.19.2
	- eslint 7.18.0
	- comma-number 2.0.1
	
### Stock information API
	- IEX cloud (https://iexcloud.io/)
		- Currently in Sandbox mode, which does not have a limit on API calls, but returns randomized quotes.  
		- Standard mode does not do this, but there are limited number of API calls available for free accounts.
-----
### Bug fixes (last edit: 3/20/2020)
Error: stock purchases were not being saved in the database
Fix: in handleSubmit() state was being cleared of ticker and quantity before the this.placeOrder() was called with ticker and quantity as arguments

Error: form was not being cleared if the stock ticker symbol was invalid
Fix: clear state (:ticker, :quantity) in the .catch block of handleSubmit()

Error: The App.js getUserStocks() takes a long time load data from API and calculate.
Fix: Add a loading state, and an indicator, turn it off once the data populates.  Conditionally render an opacity overlay on the page based on value of "loading" in state.  Same for the spinner.

Error: If portofolio is empty, App.js still tries to get list of Stocks from IEX, causing a 400 error
Fix: Add a check to make sure there are symbols in the 'symbolList', otherwise skip axios.get

Error: If order fails to go through, money is still subtracted.
Fix:  Move User balance update fetch PATCH call inside .then of the stock fetch POST generating the stock object

Error: When making purchase, openPrice is undefined.
NoFix: Not ideal - but this is expected because openPrice is calculated on Load.

Error: Order is added to database but does not show up in portfolio if stock already exists in portfolio.
Missed Feature: Only shows a symbol once even if there are multiple orders.
Fix: Update stocks_controller.rb so that if user already has stock with the same symbol, the shares are added to that object. 
    Instead of updating state from RightCol.js, getUserStocks() is passed down from App.js and used to reload the state from the database.
