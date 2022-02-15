import React, { Component } from 'react';

import {Link} from "react-router-dom";

import './registration.css';

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

class Registration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      emailError: null,
      username: '',
      usernameError: null,
      password: '',
      passwordError: null,
      repeatedPassword: '',
      repeatedPasswordError: null,
      registrationError: null,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);

    document.title = "Registration | Thunder Chat"
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleFormSubmit(event) {
    event.preventDefault();

    const csrftoken = getCookie('csrftoken');

    // Minimum eight characters, at least one digit, at least one lower case and at least one upper case:
    const strongPasswordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

    const emailRegex =  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    this.setState({
      ...this.state,
      emailError: !emailRegex.test(this.state.email)?
        'Entered email is incorrect'
        :
        null,
      passwordError: !strongPasswordRegex.test(this.state.password)?
        'Your password should contain minimum eight characters, at least one digit, at least one lower case and at least one upper case.'
        :
        null,
      repeatedPasswordError: this.state.repeatedPassword !== this.state.password?
        'Please make sure your passwords match.'
        :
        null
    });

    // Registration request to server
    if (this.state.username && this.state.password && this.state.firstName && this.state.lastName && this.state.email) {
      if (!this.state.emailError && !this.state.usernameError && !this.state.passwordError && !this.state.repeatedPasswordError) {
        console.log(csrftoken);
        const request = new Request(
          '/user-api/register',
          {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify({
            username: this.state.username,
            password: this.state.password,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            email: this.state.email,
          })
        });

        console.log(request)

        fetch(request)
          .then(response => {
            if (response.ok) {
              this.setState({
                ...this.state,
                registrationError: null,
              })

              document.location.href = '/';

              return response.json()
            } else {
              this.setState({
                ...this.state,
                registrationError: "Error creating user",
              })

              throw Error(`Something went wrong: code ${response.status}`)
            }
          })
          .catch(error => {
            console.log(error);
          })
      }
    }
  }

  render() {
    return (
      <div className="Registration">
        <Link to='/login' className='button-link'>Login</Link>
        <form className="registration-form" onSubmit={this.handleFormSubmit}>
          <p>Registration</p>
          { this.state.registrationError ? <h1>{this.state.registrationError}</h1> : null}
          <input
            type="text"
            name="username"
            id="username"
            value={this.state.username}
            onChange={this.handleInputChange}
            placeholder='Username'
          />
          <input
            type="text"
            name="firstName"
            id="first-name"
            value={this.state.firstName}
            onChange={this.handleInputChange}
            placeholder='First name'
          />
          <input
            type="text"
            name="lastName"
            id="last-name"
            value={this.state.lastName}
            onChange={this.handleInputChange}
            placeholder='Last name'
          />
          <input
            type="text"
            name="email"
            id="email"
            value={this.state.email}
            onChange={this.handleInputChange}
            placeholder='Email'
          />
          { this.state.emailError ? <p>{this.state.emailError}</p> : null}
          <input
            type="password"
            name="password"
            id="password"
            value={this.state.password}
            onChange={this.handleInputChange}
            placeholder='Password'
          />
          { this.state.passwordError ? <p>{this.state.passwordError}</p> : null}
          <input
            type="password"
            name="repeatedPassword"
            id="repeated-password"
            value={this.state.repeatedPassword}
            onChange={this.handleInputChange}
            placeholder='Repeat password'
          />
          { this.state.repeatedPasswordError ? <p>{this.state.repeatedPasswordError}</p> : null}
          <input type='submit' name='submit' value='Sign up'/>
        </form>
      </div>
    );
  }
}

export default Registration;