import React, { useState } from 'react';

import './nav.css';
import logo from "../../../public/logo.svg";

import List from "../list/List";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

function Nav(props) {
  const [query, setQuery] = useState('');

  const handleCreateChat = (event) => {
    event.preventDefault();
  }

  return (
    <div className='Nav'>
      <div className='chat-search'>
        <input type="image" src={logo} alt="loading..." style={{ flexGrow: "0" }} onClick={() => document.location.href = '/'}/>
        <input type="text" onChange={event => setQuery(event.target.value)} placeholder="Search"/>
        <label htmlFor='new-chat'>
          <FontAwesomeIcon icon={faPlus} size='1x'/>
        </label>
        <input type='image' id='new-chat' alt='plus' onClick={() => document.location.href = '/create-chat'} />
      </div>
      <List username={props.username} chatsData={props.chatsData} query={query}/>
    </div>
  );
}

export default Nav;