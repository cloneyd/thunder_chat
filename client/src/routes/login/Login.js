import { useState, useEffect } from "react";

import './login.css'
import {Link} from "react-router-dom";

function Login(props) {
  document.title = "Login | Thunder Chat";

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleFormSubmit = event => {
    event.preventDefault();

    if (!error && username && password) {
      const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      }

      fetch(
        '/user-api/login',
        request
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            if (response.status === 401) {
              throw Error('unauthorized');
            }

            throw Error(`Something went wrong: code ${response.status}`);
          }
        })

      fetch(
        '/user-api/token/obtain',
        request
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            if (response.status === 401) {
              throw Error('unauthorized');
            }

            throw Error(`Something went wrong: code ${response.status}`);
          }
        })
        .then(( {access, refresh} ) => {
          localStorage.setItem('accessToken', access);
          console.log(access);
          localStorage.setItem('refreshToken', refresh);
          console.log(refresh);

          setError(null);

          document.location.href = '/';
        })
        .catch(error => {
          console.log(error);

          if (error.message === 'unauthorized') {
            setError('Wrong username or password. Try again.');
          } else {
            setError('Error, check console');
          }
        });
    }
  }

  return (
    <div className="Login">
      <form className="login-form" onSubmit={handleFormSubmit}>
        { error ? <p>{ error }</p> : null }
        <input
          type="text"
          name="username"
          id="username"
          value={username}
          placeholder='Username'
          onChange={event => setUsername(event.target.value)}
        />
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          placeholder='Password'
          onChange={event => setPassword(event.target.value)}
        />
        <input type='submit' name='submit' value='Sign in'/>
      </form>
      <Link to="/register" className="button-link">Register</Link>
    </div>
  );
}

export default Login;