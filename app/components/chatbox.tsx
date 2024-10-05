"use client";

import { useState, useRef, useEffect } from 'react';
import RealTimeChat from './chat'; // Import the real-time chat component

interface ChatBoxProps {
  isChatOpen: boolean;
  setIsChatOpen: (value: boolean) => void;
  sessionFeedback: (feedback: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ isChatOpen, setIsChatOpen, sessionFeedback }) => {
  const [prompt, setPrompt] = useState(''); // User's question
  const [result, setResult] = useState(''); // AI's answer
  const [activeTab, setActiveTab] = useState<'ai' | 'chat'>('ai'); // Track active tab (AI Chat or Real-Time Chat)
  const [loading, setLoading] = useState(false); // Loading state for AI request
  const [error, setError] = useState(''); // Error state

  const chatBoxRef = useRef<HTMLDivElement>(null);

  // Handle AI prompt submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form from refreshing

    if (!prompt.trim()) return; // If no prompt is entered, do nothing

    setLoading(true); // Start loading
    setError(''); // Reset any previous errors

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }), // Send the user's prompt to the API
      });

      if (!response.ok) {
        throw new Error('Failed to get a response from AI'); // Handle errors if the response is not OK
      }

      const data = await response.json(); // Parse the response from the backend
      setResult(data.result || 'No response from AI'); // Set the AI's response in the state
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again later.'); // Show error message
    } finally {
      setLoading(false); // End loading
      setPrompt(''); // Clear the input after submission
    }
  };

  // Close chat box when clicking outside
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
        } w-96 bg-gray-100 shadow-lg`}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-darkBlueGray">Chat</h2>
          <button
            onClick={() => setIsChatOpen(false)}
            className="absolute top-2 right-2 text-darkBlueGray text-2xl"
          >
            ✖
          </button>

          {/* Tab Navigation */}
          <div className="mt-4 flex justify-around">
            <button
              onClick={() => setActiveTab('ai')}
              className={`py-2 px-4 ${activeTab === 'ai' ? 'bg-darkBlueGray text-light' : 'bg-light text-darkBlueGray'} rounded`}
            >
              AI Chat
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-2 px-4 ${activeTab === 'chat' ? 'bg-darkBlueGray text-light' : 'bg-light text-darkBlueGray'} rounded`}
            >
              Real-Time Chat
            </button>
          </div>

          {/* Conditionally Render Based on Active Tab */}
          {activeTab === 'ai' ? (
            <>
              {/* AI Chat */}
              <form onSubmit={handleSubmit} className="mt-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)} // Update prompt state on change
                  className="w-full p-2 bg-light border border-darkBlueGray rounded"
                  placeholder="Ask the AI something..."
                  disabled={loading} // Disable input during loading
                />
                <button type="submit" className="mt-2 bg-darkBlueGray text-light p-2 rounded w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send to AI'}
                </button>
              </form>

              {error && <p className="text-red-500 mt-4">{error}</p>} {/* Show error message */}

              <div className="mt-4">
                <h3 className="text-darkBlueGray">AI Response:</h3>
                <p>{result || "No response yet"}</p> {/* Show AI's response */}
              </div>
            </>
          ) : (
            <>
              {/* Real-Time Chat (Socket.io) */}
              <RealTimeChat /> {/* Use the real-time chat component */}
            </>
          )}
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
