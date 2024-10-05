"use client";

import { useState, useEffect, useRef } from "react";
import TaskForm from "../components/TaskForm";
import TaskApp from "../components/TaskApp";
import ChatBox from "./components/chatbox";
import CompletedTasks from "../components/CompletedTasks";

// Define the structure of a Task object
interface Task {
  id: string; // Unique ID for each task
  task: string;
  status: string;
  createdAt: string;
  ipAddress: string;
}

export default function Home() {
  const [seconds, setSeconds] = useState(1500);  // Timer starts at 25 minutes (1500 seconds)
  const [isFiveMinuteTimer, setIsFiveMinuteTimer] = useState(false);  // Toggle between 25-minute and 5-minute timers
  const [currentTime, setCurrentTime] = useState<string>("");  // State for displaying the current time
  const audioRef = useRef<HTMLAudioElement>(null);  // Reference for the audio element
  const [tasks, setTasks] = useState<Task[]>([]);  // State for the task list
  const [isChatOpen, setIsChatOpen] = useState(false);  // State for chatbox open/close

  // Handle adding a new task
  const handleNewTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  // Handle removing a task by its ID
  const removeTaskFromList = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  // Effect to manage the countdown timer
  useEffect(() => {
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(interval);  // Clean up the interval on unmount
    } else {
      if (audioRef.current) {
        audioRef.current.play();  // Play chime sound when the timer finishes
      }
      // Toggle between 25-minute and 5-minute timers when the countdown reaches zero
      setSeconds(isFiveMinuteTimer ? 1500 : 300);
      setIsFiveMinuteTimer(!isFiveMinuteTimer);
    }
  }, [seconds, isFiveMinuteTimer]);

  // Handle spacebar reset for the timer
  useEffect(() => {
    const handleKeyDown = (event: { code: string }) => {
      if (event.code === "Space") {
        setSeconds(0);  // Reset the timer when spacebar is pressed
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);  // Cleanup on unmount
  }, []);

  // Update the current time every second
  useEffect(() => {
    const updateCurrentTime = () => {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const ampm = hours >= 12 ? "pm" : "am";
      const formattedHours = hours % 12 || 12;  // Convert to 12-hour format
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      setCurrentTime(`${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`);
    };

    updateCurrentTime();  // Set the initial time when component mounts
    const interval = setInterval(updateCurrentTime, 1000);  // Update the time every second
    return () => clearInterval(interval);  // Clean up on unmount
  }, []);

  // Format seconds into mm:ss format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light text-darkBlueGray">
      {/* Pomodoro Timer */}
      <div className="p-8 bg-softPurple rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold mb-4">Pomodoro Timer</h1>
        <h2 className="text-6xl font-semibold">{formatTime(seconds)}</h2>
      </div>

      {/* Display current time */}
      <p className="text-3xl mt-8">{currentTime}</p>

      {/* Task form and task display */}
      <TaskForm onTaskSubmit={handleNewTask} />
      <TaskApp tasks={tasks} onTaskUpdate={removeTaskFromList} />
      <CompletedTasks />

      {/* ChatBox component */}
      <ChatBox
        isChatOpen={isChatOpen}  // Pass the state for chatbox visibility
        setIsChatOpen={setIsChatOpen}  // Function to toggle the chatbox visibility
        addTask={handleNewTask}  // Pass the task handler function to the chatbox
        sessionFeedback={(feedback) => console.log("Feedback:", feedback)}  // Log session feedback
      />

      {/* Audio element for the sound */}
      <audio ref={audioRef}>
        <source src="/sounds/chime.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

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
