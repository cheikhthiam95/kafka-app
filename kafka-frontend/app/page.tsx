'use client';

import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Assurez-vous que cette URL correspond à celle de votre backend

export default function Home() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    socket.on('messages', (newMessages: string[]) => {
      setMessages(newMessages);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    return () => {
      socket.off('connect');
      socket.off('messages');
      socket.off('disconnect');
    };
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      socket.emit('sendMessage', message);
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Kafka Messages</h1>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="px-4 py-2 border rounded-md text-black"
          placeholder="Enter message"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Send Message
        </button>
      </div>
      <div className="w-full max-w-md bg-white p-4 rounded-md shadow-md">
        <h2 className="text-2xl font-semibold mb-2">Received Messages</h2>
        <ul className="list-disc list-inside space-y-2">
          {messages.map((msg, index) => (
            <li key={index} className="border-b py-1 text-black">{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
