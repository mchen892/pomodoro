"use client";

import { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import CompletedTasks from '../components/CompletedTasks';
import TaskApp from '../components/TaskApp';

interface Task {
  task: string;
  status: string;
  createdAt: string;
}
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


  
 
  // Explicitly define tasks as an array of Task objects
  const [tasks, setTasks] = useState<Task[]>([]);

  // Handle adding a new task, typed explicitly
  const handleNewTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
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

  useEffect(() => {
    console.log("Updated tasks:", tasks);
  }, [tasks]);

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

      {/* Display current time below the countdown */}
      <p className="text-3xl mt-8">
        {formatCurrentTime(currentTime)}
      </p>
      <TaskForm onTaskSubmit={handleNewTask} />
      <TaskApp tasks={tasks} />
     
      
      
      {/*<TaskApp tasks={tasks} />
      <CompletedTasks/>*/}
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
  );
}
