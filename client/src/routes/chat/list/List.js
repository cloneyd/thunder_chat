import React, {useState} from 'react';
import ListItem from "./ListItem";

import './list.css';

function List(props) {
  return (
    <div className="List">
      {
        props.chatsData.filter(chat => {
          if (props.query === '') {
            return chat;
          } else if (chat.name.toLowerCase().includes(props.query.toLowerCase())) {
            return chat;
          }
        })
          .map((item, index) => {
            return (
              <ListItem
                key={index}
                id={item.id}
                name={item.name}
                username={props.username}
                lastMessageUser={item.lastMessageUser}
                lastMessageContent={item.lastMessageContent}
              />
            )
          })
      }
    </div>
  );
}

export default List;