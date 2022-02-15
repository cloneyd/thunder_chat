import { createStore } from "@reduxjs/toolkit";
import {SET_CHAT_ID, SET_CHAT_NAME, SET_USERNAME} from "./actionTypes";

const initialState = {
  username: '',
  chatId: null,
  chatName: null,

}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USERNAME:
      const { username } = action.payload;
      return {
        ...state,
        username
      };
    case SET_CHAT_ID:
      const { chatId } = action.payload;
      return {
        ...state,
        chatId
      };
    case SET_CHAT_NAME:
      const { chatName } = action.payload;
      return {
        ...state,
        chatName
      };
    default:
      return state;
  }
}

export default createStore(reducer);