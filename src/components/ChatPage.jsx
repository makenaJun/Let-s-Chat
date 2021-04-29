import React, { useEffect, useRef } from 'react';
import styles from '../App.module.css';
import { FormAddMessage } from './FormAddMessage';
import logo from '../img/logoSmall.png';
import { v1 } from 'uuid';
import { Message } from './Message';

export const ChatPage = (props) => {
    const { roomId, userName, users, messages, onSendMessage } = props;
    const messagesRef = useRef(null);

    useEffect(() => {
        messagesRef.current.scrollTo(0, messagesRef.current.scrollHeight)
    }, [messages]);

    return (<>
        <div className={styles.header}><img src={logo} alt={'logo'} /></div>
        <div className={styles.wrapChat}>

            <div className={styles.userList}>
                <div className={styles.userList__title}>
                    <span>Room: {roomId}</span>
                    <span>Online: [{users.length}]</span>
                </div>
                <div>
                    <ul className={styles.userList__body}>
                        {users.map(name => (
                            <li key={v1()} className={name === userName ? styles.owner : ''}>{name}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={styles.wrapChatContent}>
                <div ref={messagesRef} className={styles.messagesList}>
                    {messages.map(message => (<Message key={v1()} message={message} userName={userName} />))}
                </div>

                <div>
                    <FormAddMessage onSendMessage={onSendMessage} />
                </div>
            </div>
        </div>
    </>
    )
};