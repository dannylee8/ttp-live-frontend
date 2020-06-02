import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      password_confirmation: "",
      errors: "",
    };
  }

  componentDidMount() {
    // if we're already logged in, let's go home...
    return this.redirect();
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // deconstruct state into variables for clarity/simplification
    const { username, email, password, password_confirmation } = this.state;
    let user = {
      username: username,
      email: email,
      password: password,
      password_confirmation: password_confirmation,
      cash: 5000.0,
    };
    // create our new user in the backend
    axios
      .post(
        "https://ttp-live-backend.herokuapp.com/users",
        { user },
        { withCredentials: true }
      )
      .then((response) => {
        // if all is well, send our user home
        // otherwise, show errors and clear form
        if (response.data.status === "created") {
          this.props.handleLogin(response.data);
          this.redirect();
        } else {
          this.setState({
            errors: response.data.errors,
            username: "",
            email: "",
            password: "",
            password_confirmation: "",
          });
        }
      })
      .catch((error) => console.log("api errors:", error));
  };

  redirect = () => {
    this.props.history.push("/");
  };

  handleErrors = () => {
    return (
      <div>
        <ul className="error-message">
          {this.state.errors.map((error) => {
            return <li key={error}>{error}</li>;
          })}
        </ul>
      </div>
    );
  };

  render() {
    const { username, email, password, password_confirmation } = this.state;
    return (
      <>
        <div className="top-menu">
          <span className="logo">TTP Stock Trade</span>
        </div>
        <div className="center">
          <div id="login_div">
            <h4>Register</h4>
            <form className="w3-container" onSubmit={this.handleSubmit}>
              <input
                placeholder="username"
                className="w3-input w3-border w3-light-grey"
                type="text"
                name="username"
                value={username}
                onChange={this.handleChange}
              />
              <input
                placeholder="email"
                className="w3-input w3-border w3-light-grey"
                type="text"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
              <input
                placeholder="password"
                className="w3-input w3-border w3-light-grey"
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
              <input
                placeholder="password confirmation"
                className="w3-input w3-border w3-light-grey"
                type="password"
                name="password_confirmation"
                value={password_confirmation}
                onChange={this.handleChange}
              />

              <button
                className="w3-btn w3-round-large w3-blue-grey"
                placeholder="submit"
                type="submit"
              >
                Sign Up
              </button>
              <div>
                or <Link to="/login">login</Link>
              </div>
            </form>
            <br />
          </div>
          <div className="error-box">
            {this.state.errors ? this.handleErrors() : null}
          </div>
        </div>
      </>
    );
  }
}

export default Signup;
