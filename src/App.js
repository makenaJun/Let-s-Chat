import React, { useEffect } from 'react';
import styles from './App.module.css';
import { ConnectPage } from './components/ConnectPage';
import entryReducer from './entryReducer';
import { ChatPage } from './components/ChatPage';
import socket from './socket';
import axios from 'axios';


const App = () => {

  const [state, dispatch] = React.useReducer(entryReducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: []
  });

  const onLogin = async(formData) => {
    dispatch({
      type: 'JOINED',
      payload: formData
    });
    socket.emit('ROOM:JOIN', formData);
    const { data } = await axios.get(`/rooms/${formData.roomId}`);
    dispatch({
      type: 'SET_DATA',
      payload: data
    });
  };

  const setUsers = (users) => {
    dispatch({
      type: 'SET_USERS',
      payload: users
    });
  };

  const onSendMessage = (text) => {
    const obj = {
      roomId: state.roomId,
      userName: state.userName,
      text
    };
    socket.emit('ROOM:NEW_MESSAGE', obj);
    newMessages({
      userName: state.userName,
      text
    });
  };

  const newMessages = (message) => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message
    });
  };

  useEffect(() => {
    socket.on('ROOM:SET_USERS', setUsers);
    socket.on('ROOM:NEW_MESSAGE', newMessages);
  }, []);

  return (<>
    <div className={styles.wrapper}>
      {!state.joined ? <ConnectPage onLogin={onLogin} /> : <ChatPage
        userName={state.userName}
        roomId={state.roomId}
        messages={state.messages}
        users={state.users}
        onSendMessage={onSendMessage}
      />}
    </div>
    <div className={styles.footer}>
      <span>Let's Chat © 2021 Created by makena </span>
      {state.joined && <a href='/' >Log out</a>}
    </div>
  </>
  );
};

export default App;
