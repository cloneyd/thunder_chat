import React from 'react';

import './content.css';

function Message(props) {
   return (
    <div className={`Message ${props.other}`}>
      {props.other? <p className='message-username'>{props.username}</p> : null}
      <p className='message-content'>{props.content}</p>
    </div>
  );
}

export default Message;