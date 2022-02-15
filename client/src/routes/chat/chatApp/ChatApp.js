import React, { useEffect, useState } from 'react';
import connect from "react-redux";

import './chatApp.css';
import logo from '../../../public/logo.svg';

import Nav from "../nav/Nav";

function ChatApp(props) {
  document.title = "Welcome Page | Chats";

  const [username, setUsername] = useState('')
  const [access, setAccess] = useState(localStorage.getItem('accessToken'));
  const [refresh, setRefresh] = useState(localStorage.getItem('refreshToken'));
  const [refreshRequired, setRefreshRequired] = useState(false);
  const [chatsData, setChatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const request = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access}`
      }
    }

    if (access) {
      fetch(
        '/chat-api/chats',
        request
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            if (response.status === 401) {
              throw Error('refresh');
            }
            throw Error(`Something went wrong: code ${response.status}`);
          }
        })
        .then(data => {
          setUsername(data['username'])
          setChatsData(data['chats']);
          setIsLoading(false);
        })
        .catch(error => {
          if (error.message === 'refresh') {
            setRefreshRequired(true);
          } else {
            console.log(error);
          }
        })
    }
  }, [access])

  useEffect(() => {
    if (refreshRequired) {
      const request = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({ refresh })
      }

      fetch(
        '/user-api/token/refresh',
        request
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw Error(`Something went wrong: code ${response.status}`);
          }
        })
        .then(({ access }) => {
          localStorage.setItem('accessToken', access);
          setAccess(access);
        })
        .catch(error => {
          console.log(error);
        })
    }
  }, [refreshRequired]);


  return (
    isLoading?
      <main style={{ height: "100vh", display: "flex", fontSize: "30px" }}>
        <img src={logo} alt="loading..." style={{ margin: "auto", height: "256px", width: "256px" }}/>
      </main>
      :
      <div className="Chat">
        <Nav username={username} chatsData={chatsData}/>
      </div>
  );
}

export default ChatApp;