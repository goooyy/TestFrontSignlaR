import { useState } from "react";
import { Message } from "./Message";

export const Chat = ({ chatId, user, closeChat, messages, sendMessage }) => {
    const [message, setMessage] = useState("");

    const onSendMessage = () => {
        sendMessage(chatId, message);
        setMessage("");
    };

    return (
        <div>
            <div>
            <h1>{chatId}</h1>
            <button onClick={closeChat}>Close</button>
            </div>

            <div>
                {messages.map((messageInfo, index) => (
                    <Message messageInfo={messageInfo} key={index}/>
                ))} 
            </div>

            <div>
                <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="input message"/>
                <button onClick={onSendMessage}>Send</button>
            </div>
        </div>
    );
}