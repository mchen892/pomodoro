"use client";

import { useState, useEffect, useRef } from "react";
import TaskForm from "../components/TaskForm";
import TaskApp from "../components/TaskApp";
import ChatBox from "./components/chatbox";

export default function Home() {
  const [seconds, setSeconds] = useState(1500);
  const [isFiveMinuteTimer, setIsFiveMinuteTimer] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const audioRef = useRef<HTMLAudioElement>(null);
  const [tasks, setTasks] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false); // Define isChatOpen and setIsChatOpen here

  // Handle adding a new task
  const handleNewTask = (newTask: any) => {
    setTasks([...tasks, newTask]);
  };

  const removeTaskFromList = (taskId) => {
    // Remove the task with the given taskId from the state
    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
  };

  


  // Effect to manage the countdown
  useEffect(() => {
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      if (audioRef.current) {
        audioRef.current.play();
      }
      // Switch between 25-minute and 5-minute timers
      setSeconds(isFiveMinuteTimer ? 1500 : 300);
      setIsFiveMinuteTimer(!isFiveMinuteTimer);
    }
  }, [seconds, isFiveMinuteTimer]);

  // Handle spacebar reset
  useEffect(() => {
    const handleKeyDown = (event: { code: string }) => {
      if (event.code === "Space") {
        setSeconds(0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Update the current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Format seconds into mm:ss
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Format current time
  const formatCurrentTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "pm" : "am";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    } ${ampm}`;
  };

  // Correctly structured return statement
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light text-darkBlueGray">
      {/* Pomodoro Timer */}
      <div className="p-8 bg-softPurple rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold mb-4">Pomodoro Timer</h1>
        <h2 className="text-6xl font-semibold">{formatTime(seconds)}</h2>
      </div>

      {/* Display current time */}
      <p className="text-3xl mt-8">{formatCurrentTime(currentTime)}</p>

      {/* Task form and task display */}
      <TaskForm onTaskSubmit={handleNewTask} />
      <TaskApp tasks={tasks}  onTaskUpdate={removeTaskFromList} />
     <CompletedTasks />
      
      
      {/*<TaskApp tasks={tasks} />
      <CompletedTasks/>*/}

      {/* ChatBox component */}
      <ChatBox
        isChatOpen={isChatOpen} // Now correctly passing the state
        setIsChatOpen={setIsChatOpen} // Passing the function to toggle the chat
        addTask={handleNewTask} // Passing the task handler function
        sessionFeedback={(feedback) => console.log("Feedback:", feedback)} // Placeholder for session feedback
      />

      {/* Style for blink animation */}
      {/* Display current time below the countdown */}
      <p className="text-3xl mt-8">
        {formatCurrentTime(currentTime)}
      </p>

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
