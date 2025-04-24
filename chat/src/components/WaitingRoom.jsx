import React, { useState } from "react";

export const WaitingRoom = ({ joinChat, user }) => {
    const [userId, setUserId] = useState();
    const [chatId, setChatId] = useState();
    const name = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

    const onSubmit = (e) => {
        e.preventDefault();
        joinChat(chatId, userId);
    }
    
    return (
    <form onSubmit={onSubmit}>
        <h1>Chat</h1>
        <div>
            <label>UserId: {name}</label>
            {/* <input onChange={(e) => setUserId(e.target.value)} type="text" placeholder="input userId" /> */}
        </div>
        <div>
            <label>ChatId:</label>
            <input onChange={(e) => setChatId(e.target.value)} type="text" placeholder="input chatId" />
        </div>
        <button type="submit">
            Connect
        </button>
    </form>
    )
}
