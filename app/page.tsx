"use client";  // This tells Next.js to render this component on the client

import { useState, useEffect } from 'react';

export default function Home() {
  // Timer states
  const [seconds, setSeconds] = useState(1500);  // Start at 25 minutes (1500 seconds)
  const [isFiveMinuteTimer, setIsFiveMinuteTimer] = useState(false);  // Switch between 25-minute and 5-minute timers
  const [manualReset, setManualReset] = useState(false);  // Track manual resets via spacebar

  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    setResult(data.result);
  };
  // State for current time display
  const [currentTime, setCurrentTime] = useState(new Date());

  // Effect to manage the countdown
  useEffect(() => {
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);

      return () => clearInterval(interval);  // Clean up interval on unmount
    } else {
      // Switch between the 25-minute and 5-minute timers when the timer reaches 0
      if (isFiveMinuteTimer) {
        setSeconds(1500);  // Reset to 25 minutes (1500 seconds)
      } else {
        setSeconds(300);  // Reset to 5 minutes (300 seconds)
      }
      setIsFiveMinuteTimer(!isFiveMinuteTimer);  // Toggle between 25 and 5-minute timers
    }
  }, [seconds, isFiveMinuteTimer]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(event.code);  // Log the key code for debugging
  
      if (event.code === "Space") {
        setSeconds(0);
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  
  
  // Reset the manualReset flag when the timer reaches 10 seconds
  useEffect(() => {
    if (seconds !== 10) {
      setManualReset(false);
    }
  }, [seconds]);

  // Effect to update the current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);  // Clean up interval on unmount
  }, []);

  // Function to format the time into minutes and seconds
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Function to format the current time
  const formatCurrentTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;  // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div>
      <h1>OpenAI GPT-3 Next.js Example</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt"
        />
        <button type="submit">Generate Text</button>
      </form>
      <div>
        <h2>Result:</h2>
        <p>{result}</p>
      </div>
      {/* Countdown Timer */}
      <h1 className="text-6xl font-bold">
        {formatTime(seconds)}
      </h1>

      {/* Display current time below the countdown */}
      <p className="text-3xl mt-8">
        {formatCurrentTime(currentTime)}
      </p>

      <style jsx>{`
        .blink {
          animation: blink-animation 1s steps(2, start) infinite;
        }

        @keyframes blink-animation {
          to {
            visibility: hidden;
          }
        }
      `}</style>
      </div>
      </div>
