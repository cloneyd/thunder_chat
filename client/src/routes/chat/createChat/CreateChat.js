import React, {useEffect, useState} from 'react';

import './createChat.css';
import logo from "../../../public/logo.svg";
import User from "./User";
import {dom} from "@fortawesome/fontawesome-svg-core";

function CreateChat(props) {
  const [chatName, setChatName] = useState('');
  const [users, setUsers] = useState([]);
  const [membersId, setMembersId] = useState([]);
  const [access, setAccess] = useState(localStorage.getItem('accessToken'));
  const [refresh, setRefresh] = useState(localStorage.getItem('refreshToken'));
  const [refreshRequired, setRefreshRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const request = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access}`
      }
    }

    if (access) {
      setIsLoading(true);
      fetch(
        '/user-api/users',
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
          setUsers(data['users']);
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

  const chatIdUpdate = (id) => {
    if (membersId.includes(id)) {
      setMembersId(membersId.filter(elem => elem !== id));
    } else {
      setMembersId([...membersId, id]);
    }
  }

  const createChat = (event) => {
    event.preventDefault();

    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${access}`
      },
      body: JSON.stringify({
        name: chatName,
        members: membersId
      })
    }

    if (access) {
      setIsLoading(true);
      fetch(
        '/chat-api/create-chat',
        request
      )
        .then(response => {
          if (response.ok) {
            document.location.href = 'http://localhost:3000/chats'
          } else {
            if (response.status === 401) {
              throw Error('refresh');
            }
            throw Error(`Something went wrong: code ${response.status}`);
          }
        })
        .then(data => {
          setUsers(data['users']);
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
  }

  return (
    <div className='CreateChat'>
      {
        isLoading?
          <main style={{ height: "100vh", display: "flex", fontSize: "30px" }}>
            <img src={logo} alt="loading..." style={{ margin: "auto", height: "256px", width: "256px" }}/>
          </main>
          :
          <form onSubmit={event => createChat(event)} className="create-chat-form">
            <label htmlFor='chat-name'>
              Chat name
              <input id='chat-name' type='text' value={chatName} onChange={event => setChatName(event.target.value)} />
            </label>
            <label htmlFor='chat-users'>
              Select users
              <div id="chat-users">
                {
                  users.map((item, index) => {
                    return <User
                      key={index}
                      id={item.id}
                      username={item.username}
                      clickCallback={chatIdUpdate}
                    />
                  })
                }
              </div>
            </label>
            <input type='submit' value='Create chat'/>
          </form>
      }
    </div>
  );
}

export default CreateChat;