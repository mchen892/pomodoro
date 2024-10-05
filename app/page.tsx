"use client";

import { useState, useEffect, useRef } from "react";
import TaskForm from "../components/TaskForm";
import TaskApp from "../components/TaskApp";
import ChatBox from "./components/chatbox";
import CompletedTasks from "../components/CompletedTasks";

interface Task {
  id: string;
  task: string;
  status: string;
  createdAt: string;
  ipAddress: string;
}

export default function Home() {
  const [seconds, setSeconds] = useState(1500);
  const [isFiveMinuteTimer, setIsFiveMinuteTimer] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleNewTask = (taskDescription: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      task: taskDescription,
      status: "incomplete",
      createdAt: new Date().toISOString(),
      ipAddress: "127.0.0.1",
    };
    setTasks([...tasks, newTask]);
  };

  const removeTaskFromList = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

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
      setSeconds(isFiveMinuteTimer ? 1500 : 300);
      setIsFiveMinuteTimer(!isFiveMinuteTimer);
    }
  }, [seconds, isFiveMinuteTimer]);

  useEffect(() => {
    const handleKeyDown = (event: { code: string }) => {
      if (event.code === "Space") {
        setSeconds(0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const updateCurrentTime = () => {
      const date = new Date();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const ampm = hours >= 12 ? "pm" : "am";
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
      setCurrentTime(
        `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`
      );
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light text-darkBlueGray">
      {/* Pomodoro Timer */}
      <div className="flex flex-col items-center justify-center p-8 bg-softPurple rounded-lg shadow-md text-center">
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
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        addTask={handleNewTask}
        sessionFeedback={(feedback) => console.log("Feedback:", feedback)}
      />

      {/* Spotify iframe */}
      <iframe
        className="spotify-embed"
        src="https://open.spotify.com/embed/playlist/3QPsci3WscAUEkfPHb5Cw6?utm_source=generator&theme=0"
        width="300"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen // Fix the casing here
        loading="lazy"
      ></iframe>

      {/* Audio element for the sound */}
      <audio ref={audioRef}>
        <source src="/sounds/chime.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      <style jsx>{`
        .spotify-embed {
          position: absolute;
          bottom: 20px;
          left: 20px;
          border-radius: 12px;
          z-index: 1000; /* Ensure it's on top of other elements */
        }

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
