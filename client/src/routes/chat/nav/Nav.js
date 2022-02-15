import React, { useState } from 'react';

import './nav.css';
import logo from "../../../public/logo.svg";

import List from "../list/List";

function Nav(props) {
  const [query, setQuery] = useState('');

  return (
    <div className='Nav'>
      <div className='chat-search'>
        <input type="image" src={logo} alt="loading..." style={{ flexGrow: "0" }} onClick={() => {document.location.href = '/'}}/>
        <input type="text" onChange={event => setQuery(event.target.value)} placeholder="Search"/>
      </div>
      <List username={props.username} chatsData={props.chatsData} query={query}/>
    </div>
  );
}

export default Nav;