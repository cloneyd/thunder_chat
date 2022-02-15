import React from 'react';
import {Link} from "react-router-dom";

function ListItem(props) {
  return (
    <Link
      className='chat-link'
      to={`/chats/chat?sel=${props.id}`}
    >
      <button className='chat-item' type='button'>
        <h2>{ props.name }</h2>
        {
          props.lastMessageContent?
            <p><span className='last-message-user'>{ props.lastMessageUser }</span><span className='message-content'>: { props.lastMessageContent }</span></p>
          :
            <p className='last-message-content'>The chat has no messages yet.</p>
        }
      </button>
    </Link>
  )
}

export default ListItem;