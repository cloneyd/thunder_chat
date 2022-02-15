import { SET_USERNAME, SET_CHAT_ID, SET_CHAT_NAME } from "./actionTypes";

export const setUsername = username => ({
  type: SET_USERNAME,
  payload: { username }
});

export const setChatId = chatId => ({
  type: SET_CHAT_ID,
  payload: { chatId }
});

export const setChatName = chatName => ({
  type: SET_CHAT_NAME,
  payload: { chatName }
});