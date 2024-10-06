"use client";

import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message{
  username: string;
  message: string;
}

let socket: Socket; // Declare the socket variable outside the component

const usernames = ['Sarah', 'Amber', 'Maggie', 'Brooke'];

function generateUsername() {
  // Randomly select a username from the array
  const randomIndex = Math.floor(Math.random() * usernames.length);
  return usernames[randomIndex];
}

const RealTimeChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  // Initialize the Socket.io connection only once
  useEffect(() => {
    const newUsername = generateUsername();
    setUsername(newUsername);

    socket = io('https://pomopals-seven.vercel.app', {
      transports: ['websocket'], // Ensure the websocket transport is used
      reconnection: true,         // Enable reconnection
      withCredentials: true,      // Allow cross-origin requests if needed
    });

    // Socket.io: Listen for incoming messages
    socket.on('message', (message: { username: string; message: string }) => {
      console.log('Received message:', message); // Log received message
      setMessages((prevMessages) => [...prevMessages, message]);
      localStorage.setItem('latestMessage', JSON.stringify(message)); // Store incoming messages in local storage
    });

    // Listen for changes in local storage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'latestMessage') {
          const newMessage = e.newValue;
          if (newMessage) {
            const parsedMessage = JSON.parse(newMessage); // Parse the message
            setMessages((prevMessages) => [...prevMessages, parsedMessage]); // Update state with parsed message
          }
      }
  };

  window.addEventListener('storage', handleStorageChange);


    // Cleanup the socket connection when the component unmounts
    return () => {
      if (socket) {
        socket.off('message');
        window.removeEventListener('storage', handleStorageChange);
        socket.disconnect();
      }
    };
  }, []);

  // Handle user message submission via Socket.io
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input) {
      const messageData = { username, message: input };
      // Emit the message to the server
      socket.emit('message', messageData);
      localStorage.setItem('latestMessage', JSON.stringify(messageData)); // Store in local storage
      setMessages((prevMessages) => [
        ...prevMessages,
        { username: 'You', message: input }, // Store it as an object for uniformity
      ]);
      setInput(''); // Clear the input field
    }
  };

  return (
    <div>
      <form onSubmit={sendMessage} className="mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 bg-light border border-darkBlueGray rounded"
          placeholder="Send a message"
        />
        <button type="submit" className="mt-2 bg-darkBlueGray text-light p-2 rounded w-full">
          Send
        </button>
      </form>

      <div className="mt-4">
        <h3 className="text-darkBlueGray">Messages:</h3>
        <ul className="max-h-40 overflow-y-auto">
          {messages.map((msg, index) => (
            <li key={index} className="text-sm text-darkBlueGray mt-1">
              <strong>{msg.username}:</strong> {msg.message} {/* Display username and message */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RealTimeChat;
