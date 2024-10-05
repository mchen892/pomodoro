"use client";

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Initialize socket connection to the production URL
const socket = io('https://pomopals-seven.vercel.app'); // Use your real-time chat server URL

const RealTimeChat = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>('');

  // Socket.io: Listen for incoming messages
  useEffect(() => {
    socket.on('message', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  // Handle user message submission via Socket.io
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input) {
      socket.emit('message', input);
      setMessages((prevMessages) => [...prevMessages, `You: ${input}`]);
      setInput('');
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
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RealTimeChat;
