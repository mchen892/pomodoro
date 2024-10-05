"use client";

import { useState, useEffect } from 'react';
import ChatBox from './components/chatbox';
export default function Home() {
  const [seconds, setSeconds] = useState(1500);  // Start at 25 minutes (1500 seconds)
  const [isFiveMinuteTimer, setIsFiveMinuteTimer] = useState(false);  // Switch between 25-minute and 5-minute timers
  const [isChatOpen, setIsChatOpen] = useState(false);  // State for collapsible chat box
  const [currentTime, setCurrentTime] = useState(new Date());  // State for current time display

  // Task management
  const [tasks, setTasks] = useState<string[]>([]);

  // Add a task from chatbot
  const addTask = (task: string) => {
    setTasks((prevTasks) => [...prevTasks, task]);
  };

  // Post-Pomodoro reflection
  const sessionFeedback = (feedback: string) => {
    console.log('Session Feedback:', feedback);  // Log feedback for now, or use it for future logic
  };

  // Effect to manage the countdown
  useEffect(() => {
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
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

  // Effect to handle spacebar reset
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        setSeconds(0);  // Reset timer when spacebar is pressed
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);  // Cleanup on unmount
    };
  }, []);

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-light text-darkBlueGray">
      {/* Pomodoro Timer */}
      <div className="p-8 bg-softPurple rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold mb-4">Pomodoro Timer</h1>
        <h2 className="text-6xl font-semibold">
          {formatTime(seconds)}
        </h2>
      </div>

      {/* Display Current Time */}
      <p className="text-2xl mt-6">{formatCurrentTime(currentTime)}</p>

      {/* Display Tasks */}
      <div className="mt-8 bg-grayish p-4 rounded-lg w-80 shadow-sm">
        <h2 className="text-2xl mb-2 font-semibold">Tasks</h2>
        <ul className="list-disc ml-5">
          {tasks.map((task, index) => (
            <li key={index} className="text-lg">{task}</li>
          ))}
        </ul>
      </div>

      {/* ChatBox Component */}
      <ChatBox
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        addTask={addTask}
        sessionFeedback={sessionFeedback}
      />

      {/* Toggle Chat Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed right-4 bottom-4 bg-darkBlueGray text-white p-4 rounded-full shadow-lg"
        >
          💬
        </button>
      )}
    </div>
  );
}
