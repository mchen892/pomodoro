"use client";

import { useState, useEffect, useRef } from "react";
import TaskForm from "../components/TaskForm";
import TaskApp from "../components/TaskApp";
import ChatBox from "./components/chatbox";
import CompletedTasks from "../components/CompletedTasks";

interface Task {
  _id: any;
  username: string;
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

  const handleNewTask = (newTask : Task) => {
    // Here we assume the newTask contains the full task object (including _id from the database)
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };
  

  // Handle removing a task by its ID
  const removeTaskFromList = (taskId : string) => {
    // Remove the task with the given taskId from the state
    setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
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
    <div className="flex flex-col items-center justify-center min-h-screen text-darkBlueGray">
      <div className="container">
        <div className="leftcontainer">
        <CompletedTasks />
        </div>
        <div className="rightcontainer">
          <div className ="clockdiv">
              {/* Pomodoro Timer */}
            <div className="flex flex-col items-center justify-center p-8 bg-softPurple rounded-lg shadow-md text-center">
              <h2 className="text-6xl font-semibold justify-center ">{formatTime(seconds)}</h2>
            </div>
            {/* Display current time */}
            <p className="text-3xl mt-8 justify-center ">{currentTime}</p>
              {/* Task form and task display */}
          </div>
         
          <TaskForm onTaskSubmit={handleNewTask} />
          <TaskApp tasks={tasks}  onTaskUpdate={removeTaskFromList} />
        </div>
      </div>
      
      

     

      
      

      {/* ChatBox component */}
      <ChatBox
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
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

      .container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 95%;
        height: 100vh; /* Full height of the screen */
        padding: 20px 0;
        box-sizing: border-box; /* Ensures padding is inside the width */
        max-width: 1800px; /* Limit the width of the container */
      }

      .leftcontainer {
        flex: 1; /* Take up 1 part of the available space */
        padding-right: 20px;
        margin-left: 0px;
        margin-right: auto;
        overflow-y: auto;
        width: 90%;
      }

      .rightcontainer {
        flex: 2; /* Take up 2 parts of the available space */
        padding-left: 20px;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-top: 60px;
      }

      .clockdiv{
        width: 80%;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 40px;
        }

      .timer-container {
        margin-top: 60px;
        margin-bottom: 40px;
      }

      p {
        text-align: center; /* Center the time text */
      }

      
 

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
