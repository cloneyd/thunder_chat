import React, { Component , createRef } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import Message from "./Message";

import "./content.css";

const wsHost = 'localhost:8000';


// TODO: Remove this.props.location.state and make a Redux store
class Content extends Component {
  messagesEndRef = createRef();

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      chatName: '',
      messages: [],
      membersCount: 1,
      textMessage: ''
    };

    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);

    document.title = `Messenger | Thunder Chat`;
  }

  url = new URL(window.location.href)
  chatId = this.url.searchParams.get('sel');
  ws = new WebSocket(
    'ws://'
    + wsHost
    +'/ws/chat/'
    + this.chatId
    + '/'
  );

  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView();
  };

  sendMessage = (data) => {
    try {
      this.ws.send(JSON.stringify({ data }))
    } catch (err) {
      console.log(err.message)
    }
  }

  componentDidMount() {
    this.ws.onopen = () => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.sendMessage({
          'command': 'fetch_messages'
        });
      }
    }

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      switch (data.command) {
        case 'messages': {
          const messages = data.messages;
          this.setState({...this.state, messages});
          this.scrollToBottom();
          break;
        }

        case 'new_message': {
          console.log('new_message');
          const {username, content} = data.message;
          const message = {
            username: username,
            content: content
          }
          console.log(message);
          this.setState({
            ...this.state,
            messages: [...this.state.messages, message]
          });
          this.scrollToBottom();
          console.log(this.state.messages);
          break;
        }

        case 'chat_data': {
          console.log('chat_data');
          const { username, chatName, membersCount } = data.meta;
          this.setState({
            ...this.state,
            username,
            chatName,
            membersCount
          });
          break;
        }

        default:
          break;
      }
    }

   this.ws.onclose = () => {
      console.log('disconnected');
   };

    this.scrollToBottom();
  }

  handleSendMessage = (event) => {
    event.preventDefault();

    if (this.ws.readyState === WebSocket.OPEN) {
      const message = {
        'command': 'send_chat',
        'content': this.state.textMessage
      }
      this.sendMessage(message);
      this.setState({...this.state, textMessage: ''});
    }
  }

  render() {
    return (
      <div className="Content">
      <div className="info">
        <div className='chat-data'>
          <p className='chat-name'>{this.state.chatName}</p>
          <p className='members-count'>Members: {this.state.membersCount}</p>
        </div>
      </div>
      <div id="chat">
        {
          this.state.messages.length ?
            this.state.messages.map((item, index) => {
              const other = item.username !== this.state.username ? 'other' : ''
              return (
                <Message
                  key={index}
                  other={other}
                  username={item.username}
                  content={item.content}
                />
              )
            })
            :
            <p id="no-messages">There is no messages right now. Be the first and start the conversation! </p>
        }
        <div ref={this.messagesEndRef}/>
      </div>
      <form className="message-input" onSubmit={this.handleSendMessage}>
        <label htmlFor='file-upload'>
          <FontAwesomeIcon icon={faPlus} size='1x'/>
        </label>
        <input type='file' id='file-upload'/>
        <input
          type='text'
          value={this.state.textMessage}
          onChange={event => this.setState({ ...this.state, textMessage: event.target.value})}
          placeholder='Write a message...'
        />
        <label htmlFor='send-message'>
          <FontAwesomeIcon icon={faPaperPlane} size='1x'/>
        </label>
        <input
          type='submit'
          id='send-message'
        />
      </form>
    </div>
    );
  }
}

export default Content;