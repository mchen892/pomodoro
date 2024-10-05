"use client";

import { useState, useEffect, useRef } from "react";
import TaskForm from "../components/TaskForm";
import TaskApp from "../components/TaskApp";
import ChatBox from "./components/chatbox";
import CompletedTasks from "../components/CompletedTasks";

interface Task {
  _id: any;
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
  const [file, setFile] = useState<File | null>(null); // Changed to allow null
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // Handle file input change event outside of uploadFile
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0] || null);
  };

  const uploadFile = async () => {
    try {
      if (!file) {
        alert("No file selected");
        return;
      }

      setUploading(true);
      const data = new FormData();
      data.set("file", file);
      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: data,
      });
      const signedUrl = await uploadRequest.json();
      setUrl(signedUrl);
      setUploading(false);
    } catch (e) {
      console.log(e);
      setUploading(false);
      alert("Trouble uploading file");
    }
  };

  const handleNewTask = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const removeTaskFromList = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  // Other effects (e.g., timer countdown, current time)
  // ...

  return (
    <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
      <input type="file" onChange={handleChange} />
      <button disabled={uploading} onClick={uploadFile}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      <div className="flex flex-col items-center justify-center min-h-screen bg-light text-darkBlueGray">
        {/* Pomodoro Timer */}
        {/* Display TaskForm, TaskApp, and other components */}
      </div>

      {/* Spotify iframe */}
      <iframe
        className="spotify-embed"
        src="https://open.spotify.com/embed/playlist/3QPsci3WscAUEkfPHb5Cw6?utm_source=generator&theme=0"
        width="300"
        height="80"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
        loading="lazy"
      ></iframe>

      {/* Audio element for the sound */}
      <audio ref={audioRef}>
        <source src="/sounds/chime.mp3" type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>

      {/* CSS styles */}
    </main>
  );
}
