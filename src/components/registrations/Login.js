import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: "",
    };
  }

  componentDidMount() {
    // console.log(this.props.loggedInStatus)
    return this.props.loggedInStatus ? this.redirect() : null;
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    let user = {
      email: email,
      password: password,
    };
    axios
      .post(
        "https://ttp-live-backend.herokuapp.com/login",
        { user },
        { withCredentials: true }
      )
      .then((response) => {
        if (response.data.logged_in) {
          this.props.handleLogin(response.data);
          this.redirect();
        } else {
          this.setState({
            errors: response.data.errors,
            email: "",
            password: "",
          });
        }
      })
      .catch((error) => console.log("api errors:", error));
  };

  redirect = () => {
    console.log("push");
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
    const { email, password } = this.state;
    return (
      <>
        <div className="top-menu">
          <span className="logo">TTP Stock Trade</span>
        </div>
        <div className="center">
          <div id="login_div">
            <h4>Sign In</h4>
            <form className="w3-container" onSubmit={this.handleSubmit}>
              <input
                placeholder="email"
                className="w3-input w3-border w3-light-grey"
                type="text"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
              <br></br>
              <input
                placeholder="password"
                className="w3-input w3-border w3-light-grey"
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
              <button
                className="w3-btn w3-round-large w3-blue-grey"
                placeholder="submit"
                type="submit"
              >
                Log In
              </button>
              <div>
                or <Link to="/signup">register</Link>
              </div>
            </form>
          </div>
          <div className="error-box">
            {this.state.errors ? this.handleErrors() : null}
          </div>
          <div>
            <h4>Login with any of these demo emails:</h4>
            <p>danny@email.com, ml@email.com, rj@email.com, jr@email.com</p>
            <p>password: password</p>
            <p>
              <a target="_new" href="https://github.com/dannylee8/ttp">
                Github repository
              </a>
              <br />
              <a
                target="_new"
                href="https://www.youtube.com/watch?v=d01i3acbZt4&feature=youtu.be"
              >
                Walkthru on YouTube
              </a>
            </p>
            <p>
              Visit my <a href="https://www.panix.com/~dreamer/">homepage</a>!
            </p>
          </div>
        </div>
      </>
    );
  }
}

export default Login;
