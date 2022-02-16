import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Login from "./routes/login/Login";
import Registration from "./routes/registration/Registration";
import ChatApp from "./routes/chat/chatApp/ChatApp";
import Nav from './routes/chat/nav/Nav';
import Content from "./routes/chat/content/Content";
import reportWebVitals from './reportWebVitals';

import store from "./redux/store";
import { Provider } from "react-redux";

import {
  BrowserRouter,
  Routes,
  Route 
} from "react-router-dom";
import CreateChat from "./routes/chat/createChat/CreateChat";

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Registration />} />
          <Route path='chats' element={<ChatApp />} />
          <Route path='create-chat' element={<CreateChat />} />
          <Route path='chats/:chatId' element={<Content />} />
          <Route
            path='*'
            element={
              <main style={{ height: "100vh", display: "flex", fontSize: "30px" }}>
                <p style={{ margin: "auto" }}>There's nothing here</p>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
