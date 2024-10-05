"use client";

import { useState, useRef, useEffect } from 'react';

interface ChatBoxProps {
  isChatOpen: boolean;
  setIsChatOpen: (value: boolean) => void;
  addTask: (task: string) => void;
  sessionFeedback: (feedback: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ isChatOpen, setIsChatOpen, addTask, sessionFeedback }) => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    processBotResponse(prompt);
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    setResult(data.result);
  };

  const processBotResponse = (userInput: string) => {
    const lowerCaseInput = userInput.toLowerCase();
    if (lowerCaseInput.startsWith('add task:')) {
      const newTask = userInput.substring(9).trim();
      addTask(newTask);
      setResult(`Task added: "${newTask}"`);
    } else if (lowerCaseInput.includes('tired')) {
      setResult('Take a break! How about stretching or a short walk?');
    } else if (lowerCaseInput.includes('focus')) {
      setResult('To improve focus, try a quick meditation or deep breathing.');
    } else if (lowerCaseInput.startsWith('session feedback:')) {
      const feedback = userInput.substring(17).trim();
      sessionFeedback(feedback);
      setResult(`Thank you for your feedback: "${feedback}".`);
    } else {
      setResult('Sorry, I didn’t understand that.');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(event.target as Node)) {
        setIsChatOpen(false);
      }
    };
    if (isChatOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatOpen]);

  return (
    <>
      {/* Collapsible Chat Box */}
      <div
        ref={chatBoxRef}
        className={`fixed right-0 top-0 h-full transition-transform duration-300 ${
          isChatOpen ? 'translate-x-0' : 'translate-x-full'
        } w-96 bg-grayish shadow-lg`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-darkBlueGray">AI Chat</h2>
          <button
            onClick={() => setIsChatOpen(false)}
            className="absolute top-2 right-2 text-darkBlueGray text-2xl"
          >
            ✖
          </button>
          <form onSubmit={handleSubmit} className="mt-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 bg-light border border-darkBlueGray rounded"
              placeholder="Ask me something..."
            />
            <button type="submit" className="mt-2 bg-darkBlueGray text-light p-2 rounded w-full">
              Send
            </button>
          </form>
          <div className="mt-4">
            <h3 className="text-darkBlueGray">Response:</h3>
            <p>{result}</p>
          </div>
        </div>
      </div>

      {/* Toggle Chat Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed right-4 bottom-4 bg-darkBlueGray text-white p-4 rounded-full shadow-lg"
        >
          💬
        </button>
      )}
    </>
  );
};

export default ChatBox;
