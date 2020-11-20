import React, {useState, useEffect} from "react";
import openSocket from 'socket.io-client';

const SocketTest = () => {
    const [socket, setSocket] = useState("");
    // establish socket connection
    useEffect(() => {
        setSocket(openSocket("http://127.0.0.1:5000"));
    }, []);

    useEffect(() => {
        if (!socket) return;
        // Connection event
        socket.on('connect', () => {
            socket.emit('my event', {json: 'I\'m connected!'})
        });
    }, [socket])

    return(
        <div>
            <p>Hello from Socket test component</p>
        </div>
    )
}

export default SocketTest